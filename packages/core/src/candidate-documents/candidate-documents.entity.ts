import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Index, RelationId } from 'typeorm';
import { ICandidateDocument, ICandidate } from '@gauzy/contracts';
import { IsString } from 'class-validator';
import {
	Candidate,
	TenantOrganizationBaseEntity
} from '../core/entities/internal';
import { MultiORMColumn, MultiORMEntity } from './../core/decorators/entity';
import { MikroOrmCandidateDocumentRepository } from './repository/mikro-orm-candidate-document.repository';
import { MultiORMManyToOne } from '../core/decorators/entity/relations';

@MultiORMEntity('candidate_document', { mikroOrmRepository: () => MikroOrmCandidateDocumentRepository })
export class CandidateDocument extends TenantOrganizationBaseEntity implements ICandidateDocument {
	@ApiProperty({ type: () => String })
	@MultiORMColumn()
	name: string;

	@ApiPropertyOptional({ type: () => String })
	@MultiORMColumn({ nullable: true })
	documentUrl: string;

	/*
	|--------------------------------------------------------------------------
	| @ManyToOne
	|--------------------------------------------------------------------------
	*/
	@ApiPropertyOptional({ type: () => Candidate })
	@MultiORMManyToOne(() => Candidate, (candidate) => candidate.documents, {
		onDelete: 'CASCADE'
	})
	candidate?: ICandidate;

	@ApiProperty({ type: () => String })
	@RelationId((it: CandidateDocument) => it.candidate)
	@IsString()
	@Index()
	@MultiORMColumn({ nullable: true, relationId: true })
	candidateId?: string;
}
