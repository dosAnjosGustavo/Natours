import Tour from '../models/tourModel';

// Build query
export default class APIFeatures {
  constructor(public query: any, public queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1A) Filtering
  filter() {
    const queryObj = { ...this.queryString };
    const excluideFields = ['page', 'sort', 'limit', 'fields'];
    excluideFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    const queryStr = JSON.stringify(queryObj);
    const queryStrMod = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g, // b=word boundary(exactly that words), g=global(all matches), e=expression
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStrMod));
    return this;
  }

  // 2) Sorting
  sort() {
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      const sortBy = (this.queryString.sort as string).split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  // 3) Field Limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string).split(',').join(' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v'); // exclude __v field
    }
    return this;
  }

  // 4) Pagination
  async paginate() {
    const page = +(this.queryString.page as unknown as number) || 1;
    const limit = +(this.queryString.limit as unknown as number) || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    if (this.queryString.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }
    return this;
  }
}
