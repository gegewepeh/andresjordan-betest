export const userSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userName", "accountNumber", "emailAddress", "identityNumber"],
      properties: {
        userName: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        emailAddress: {
          pattern: "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
          bsonType: "string",
          description: "must be a string and is required and in email format"
        },
        accountNumber: {
          bsonType: ["array"],
          items: {
            bsonType: "int",
            description: "must be a number and is required"
          }
        },
        identityNumber: {
          bsonType: "int",
          description: "must be a number and is required"
        }
      }
    }
  }
}

