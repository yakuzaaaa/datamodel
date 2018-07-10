/* global describe, it, beforeEach */
/* eslint-disable no-unused-expressions */
import { DimensionSubtype, FieldType } from 'picasso-util';
import { expect } from 'chai';

import Field from './field';
import PartialField from './partial-field';
import Measure from './measure';
import Dimension from './dimension';
import DateTime from './datetime';


describe('Field Type', () => {
    const schema = {
        name: 'Miles_per_Gallon',
        type: FieldType.MEASURE,
        description: 'This is description'
    };
    // Use empty data array to mock field.parse() method
    const data = [];
    let field2;

    beforeEach(() => {
        let partialfield = new PartialField(schema.name, data, schema);
        field2 = new Field(partialfield, null);
    });

    it('hello should hold data and schema references', () => {
        // expect(field2.data).to.deep.equal(data);
        expect(field2.schema).to.deep.equal(schema);
    });

    it('should implement getter methods', () => {
        expect(field2.fieldName()).to.equal(schema.name);
        expect(field2.type()).to.equal(schema.type);
        expect(field2.description()).to.equal(schema.description);
    });

    describe('#prototype.clone()', () => {
        it('should clone current instance with new data', () => {
            const newData = [];
            const cloned = field2.clone(newData);

            expect(cloned.data).to.deep.equal(newData);
            expect(cloned.schema).to.deep.equal(field2.schema);

            expect(cloned.fieldName()).to.equal(field2.fieldName());
            expect(cloned.type()).to.equal(field2.type());
            expect(cloned.description()).to.equal(field2.description());
        });

        it('should clone current instance without new data', () => {
            const cloned = field2.clone();

            expect(cloned.data).to.deep.equal(field2.data);
            expect(cloned.schema).to.deep.equal(field2.schema);

            expect(cloned.fieldName()).to.equal(field2.fieldName());
            expect(cloned.type()).to.equal(field2.type());
            expect(cloned.description()).to.equal(field2.description());
        });
    });

    describe('New Measure Field Type', () => {
        const schema3 = {
            name: 'Miles_per_Gallon',
            type: FieldType.MEASURE,
            unit: 'cm',
            scale: '1000',
            numberformat: '12-3-3',
            description: 'This is description',
            defAggFn: () => {}
        };
        const data3 = [1, 3, 4, 78];

        let field3;

        beforeEach(() => {
            let partialField = new Measure(schema3.name, data3, schema3);
            field3 = new Field(partialField, '0-3');
        });

        it('should implement getter methods', () => {
            expect(field3.unit()).to.equal(schema3.unit);
            expect(field3.scale()).to.equal(schema3.scale);
            expect(field3.numberformat()).to.equal(schema3.numberformat);
            expect(field3.defAggFn()).to.equal(schema3.defAggFn);
        });


        describe('#prototype.domain()', () => {
            it('should return measure domain', () => {
                const domain = field3.domain();

                expect(domain).to.deep.equal([1, 78]);
            });
        });

        describe('#prototype.parse()', () => {
            it('should return number for parsable field value', () => {
                expect(field3.parse('123')).to.equal(123);
            });

            it('should return null for non-parsable field value', () => {
                expect(field3.parse('not-a-number')).to.null;
                expect(field3.parse(NaN)).to.null;
            });
        });

        describe('New Dimension Field Test', () => {
            const schema2 = {
                name: 'Country',
                type: FieldType.DIMENSION
            };
            const data2 = ['India', 'USA', 'Japan', 'China', 'India', 'Japan'];
            let field;

            beforeEach(() => {
                let partialField = new Dimension(schema2.name, data2, schema2);
                field = new Field(partialField, '0-5');
            });

            describe('#prototype.domain()', () => {
                it('should return dimension domain', () => {
                    const domain = field.domain();
                    expect(domain.sort()).to.deep.equal(['India', 'USA', 'Japan', 'China'].sort());
                });
            });
        });

        it('Should correctly calculate Min diff between dates array', () => {
            const schema2 = {
                name: 'Date',
                type: 'dimension',
                subtype: DimensionSubtype.TEMPORAL,
                format: '%Y-%m-%d'
            };
            const data2 = ['2017-03-01', '2017-03-02', '2017-03-03'];
            let partialField = new DateTime(schema2.name, data2, schema2);
            let field = new Field(partialField, null);
            let diff = field.getMinDiff();
            expect(diff).to.equal(86400000);
        });
    });
});
