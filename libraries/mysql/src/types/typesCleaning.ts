export type ObjectTypeOptions = ['flat', 'house', 'floor'];

type TupleToUnion<T extends unknown[]> = T[number];

export type TypeOrder = {
  objectType: TupleToUnion<ObjectTypeOptions>;
};
