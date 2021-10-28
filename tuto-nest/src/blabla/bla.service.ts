import { Injectable, NotFoundException } from "@nestjs/common";
import { userInfo } from "os";
import { Bla } from "./bla.model"

@Injectable()
export class BlaService
{
	private blas: Bla[] = [];

	setId()	: number{
		return this.blas.length;
	}

	insertBla(title: string, desc: string, price: number) : string {
		const id = this.setId().toString();
		const newBla = new Bla(id, title, desc, price);
		this.blas.push(newBla);
		return id;
	}

	getAllUsers(): Bla[] {
		return [...this.blas]; //Don't return ref/ptr to 'blas', this syntax extracts all elements from 'blas' and put them in a new array (so there's no way to edit 'blas' outside of this class)
	}

	private getUser(id: string): [Bla, number] {
		const index = this.blas.findIndex((usr) => usr.id == id);
		if (index == -1) {
			throw new NotFoundException();
		}

		return [this.blas[index], index];
	}

	getUserInfo(id: string): Bla {
		const user = this.getUser(id)[0];
		return { ...user };
	}

	updateUserInfo(newUserData: Bla) {
		let user = this.getUser(newUserData.id)[0];

		for (let field in user) {
			if (newUserData[field]) {
				user[field] = newUserData[field];
			}
		}
	}

	deleteSingleUser(id: string)
	{
		const userIndex = this.getUser(id)[1];
		this.blas.splice(userIndex, 1);
	}
}