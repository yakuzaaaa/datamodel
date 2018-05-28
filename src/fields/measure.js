import Field from './field';
import { generateMeasureDomain } from '../utils/domain-generator';
/**
 * The Field for storing measure/numeric data
 * @extends Field
 */
class Measure extends Field {
    constructor(name, data, schema) {
        super(name, data, schema);
        this.unit = schema.unit;
        this.scale = schema.scale;
        this.numberformat = schema.numberformat;
        this.defAggFn = schema.defAggFn;
    }
    getDomain() {
        return generateMeasureDomain(this.data);
    }
    /**
     * This funciton is called once for every entries of the column. The parse is called with raw data in cell and its
     * parse's responsibility to return the correct parsed value.
     *
     * @param {Object} val entries present in a column
     *
     * @return {integer | null} integer value of content of cell, otherwise null
     */
    parse (val) {
        val = parseFloat(val, 10);
        /* eslint-disable no-self-compare */
        if (val !== val) {
        /* eslint-enable no-self-compare */
            return null;
        }
        return val;
    }

    /**
     * @returns {String} unit of fields
     */
    unit() {
        return this.unit;
    }
    /**
     * @returns {String} Scale of fields
     */
    scale() {
        return this.getScale;
    }
    /**
     * @returns {String} NumberFormat of fields
     */
    numberformat() {
        return this.numberformat;
    }
    /**
     * @returns {String} Agg Function of fields
     */
    defAggFn() {
        return this.defAggFn;
    }
}

export { Measure as default };
