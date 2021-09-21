import { Module } from '@nestjs/common';
import { JunoService } from './juno.service';

// export * from './entities';
// export * from './enums';
// export * from './inputs';
// export * from './resources';
// export * from './responses';

@Module({
  providers: [JunoService],
  exports: [JunoService],
})
export class JunoModule {}
