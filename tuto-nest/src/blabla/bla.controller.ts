import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { title } from "process";
import { Bla } from "./bla.model";
import { BlaService } from "./bla.service"

@Controller('bla')
export class BlaController
{
	constructor(private readonly blaService: BlaService) {};

	@Post()
	addBla(@Body() body: {'title': string, 'description': string, 'price': number}) {
		const newId = this.blaService.insertBla(body.title, body.description, body.price);
		return {id: newId}; //Return JSON object (best than 'text/html' for an API)
	}

	@Get()
	allUsers() {
		return this.blaService.getAllUsers();
	}

	@Get(':id')
	getUser(@Param('id') blaId: string) {
		return this.blaService.getUserInfo(blaId);
	}

	@Patch(':id')
	upadateUser(
		@Param('id') blaId: string,
		@Body('title') title: string,
		@Body('description') desc: string,
		@Body('price') price: number) {
		this.blaService.updateUserInfo(new Bla(blaId, title, desc, price))
		return this.getUser(blaId);
	}

	@Delete(':id')
	deleteUser(@Param('id') userId: string) {
		this.blaService.deleteSingleUser(userId);
		return "User deleted successfully";
	}
}