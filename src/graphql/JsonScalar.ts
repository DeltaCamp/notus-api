import { GraphQLScalarType, Kind } from "graphql";

export const JsonScalar = new GraphQLScalarType({
  name: "Json",
  description: "Json object scalar type",
  parseValue(value: string) {
    return JSON.parse(value)
  },
  serialize(value: any) {
    return JSON.stringify(value)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value)
    }
    return null;
  },
});