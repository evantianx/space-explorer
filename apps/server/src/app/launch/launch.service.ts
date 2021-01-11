import { HttpService, Injectable } from '@nestjs/common';
import {
  LaunchConnectionModel,
  LaunchModel,
  SpacexLaunch,
} from '@space-explorer/types';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class LaunchService {
  private apiUrl = 'https://api.spacexdata.com/v3';

  constructor(private http: HttpService) {}

  private toLaunch(launch: SpacexLaunch): LaunchModel {
    return {
      id: String(launch.flight_number || 0),
      site: launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    };
  }

  private paginate(
    results: LaunchModel[],
    pagesize: number,
    cursor?: string
  ): LaunchConnectionModel {
    const cursorIndex = cursor ? results.findIndex((r) => r.id === cursor) : 0;
    const launches = results.slice(cursorIndex, cursorIndex + pagesize);
    const nextCursor = results[cursorIndex + pagesize]?.id;
    const hasMore = Boolean(results[nextCursor]);
    return {
      cursor: nextCursor,
      hasMore,
      launches,
    };
  }

  getAllLaunches(
    pageSize = 10,
    cursor?: string
  ): Observable<LaunchConnectionModel> {
    return this.http.get<SpacexLaunch[]>(`${this.apiUrl}/launches`).pipe(
      map(({ data }) => data.map(this.toLaunch)),
      map((data) => this.paginate(data, pageSize, cursor))
    );
  }

  getLaunchById(id: number): Observable<LaunchModel> {
    return this.http
      .get<SpacexLaunch>(`${this.apiUrl}/launches/${id}`)
      .pipe(map(({ data }) => this.toLaunch(data)));
  }

  getLaunchByIds(ids: number[]): Observable<LaunchModel[]> {
    return forkJoin(ids.map((id) => this.getLaunchById(id))).pipe(
      mergeMap((res) => of(res))
    );
  }
}
