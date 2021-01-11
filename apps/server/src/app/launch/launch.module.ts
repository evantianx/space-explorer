import { HttpModule, Module } from '@nestjs/common';
import { LaunchResolver } from './launch.resolver';
import { LaunchService } from './launch.service';
import { MissionResolver } from './mission.resolver';

@Module({
  imports: [HttpModule],
  providers: [LaunchService, LaunchResolver, MissionResolver],
  exports: [LaunchService],
})
export class LaunchModule {}
