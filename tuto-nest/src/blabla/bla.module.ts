import { Module } from "@nestjs/common";
import { BlaController } from "./bla.controller";
import { BlaService } from "./bla.service";

@Module({
	imports: [],
	controllers: [BlaController],
	providers: [BlaService]
})
export class BlaModule {};