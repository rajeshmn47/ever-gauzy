import {
	JoinColumn,
	RelationId,
	Index
} from 'typeorm';
import {
	IProductTranslatable,
	IWarehouse,
	IWarehouseProduct,
	IWarehouseProductVariant
} from '@gauzy/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	Product,
	Warehouse,
	WarehouseProductVariant,
	TenantOrganizationBaseEntity
} from '../core/entities/internal';
import { ColumnNumericTransformerPipe } from './../shared/pipes';
import { MultiORMColumn, MultiORMEntity } from './../core/decorators/entity';
import { MikroOrmWarehouseProductRepository } from './repository/mikro-orm-warehouse-product.repository ';
import { MultiORMManyToOne, MultiORMOneToMany } from '../core/decorators/entity/relations';

@MultiORMEntity('warehouse_product', { mikroOrmRepository: () => MikroOrmWarehouseProductRepository })
export class WarehouseProduct extends TenantOrganizationBaseEntity
	implements IWarehouseProduct {

	@ApiPropertyOptional({ type: Number })
	@MultiORMColumn({
		nullable: true,
		type: 'numeric',
		default: 0,
		transformer: new ColumnNumericTransformerPipe()
	})
	quantity: number;

	/*
	|--------------------------------------------------------------------------
	| @ManyToOne
	|--------------------------------------------------------------------------
	*/

	/**
	 * Warehouse
	 */
	@ApiProperty({ type: () => Warehouse })
	@MultiORMManyToOne(() => Warehouse, (warehouse) => warehouse.products, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	warehouse: IWarehouse;

	@ApiProperty({ type: () => String })
	@RelationId((it: WarehouseProduct) => it.warehouse)
	@Index()
	@MultiORMColumn({ relationId: true })
	warehouseId: string;

	/**
	 * Product
	 */
	@ApiProperty({ type: () => Product })
	@MultiORMManyToOne(() => Product, (product) => product.warehouses, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	product: IProductTranslatable;

	@ApiProperty({ type: () => String })
	@RelationId((it: WarehouseProduct) => it.product)
	@Index()
	@MultiORMColumn({ relationId: true })
	productId: string;

	/*
	|--------------------------------------------------------------------------
	| @OneToMany
	|--------------------------------------------------------------------------
	*/
	@ApiProperty({ type: () => WarehouseProductVariant, isArray: true })
	@MultiORMOneToMany(() => WarehouseProductVariant, (warehouseProductVariant) => warehouseProductVariant.warehouseProduct, {
		cascade: true
	})
	@JoinColumn()
	variants: IWarehouseProductVariant[];
}
