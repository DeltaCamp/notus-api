import { GraphQLScalarType, Kind } from "graphql";

export const IntervalScalar = new GraphQLScalarType({
  name: "Interval",
  description: "Interval object scalar type",
  parseValue(value: string) {
    console.log('!!!!!!!!', value)
    return value
  },
  serialize(value: any) {
    console.log('?????????', value, typeof value, value.constructor)
    return value.toString()
  },
  parseLiteral(ast) {
    console.log('+++++++', ast.toString())
    if (ast.kind === Kind.STRING) {
      return ast.value.toString()
    }
    return null;
  },
});