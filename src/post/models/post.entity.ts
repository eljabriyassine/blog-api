import { UserEntity } from 'src/users/models/user.entity';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

@Entity({ name: 'post' })
export class PostEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	title: string;

	@Column()
	description: string;

	@Column()
	imgUrl: string;

	@Column({ default: new Date() })
	createdAt: Date;

	@Column({ default: new Date() })
	updatedAt: Date;

	@Column()  // Explicitly defining the userId column
	userId: string;  // Adjust to match the type of the user ID (e.g., string or uuid)

	@ManyToOne(
		() => UserEntity,
		user => user.posts,
		{ onDelete: 'CASCADE' }  // Optionally specify cascading delete behavior
	)
	@JoinColumn({ name: 'userId' })
	user: UserEntity;
}
