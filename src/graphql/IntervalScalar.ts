import { GraphQLScalarType, Kind } from "graphql";

export const IntervalScalar = new GraphQLScalarType({
  name: "Interval",
  description: "Interval object scalar type",
  parseValue(value: string) {
    return value
  },
  serialize(value: any) {
    return value.toString()
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value.toString()
    }
    return null;
  },
});