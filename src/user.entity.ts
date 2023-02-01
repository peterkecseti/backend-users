import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
@Entity()
export default class User{
@PrimaryGeneratedColumn()
id: number;

@Column()
email: string;

@Column()
password: string;

@Column()
proiflePictureUrl: string;

@Column()
registrationDate: Date;
}