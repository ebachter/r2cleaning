import {Validator} from 'jsonschema';

const labelLengthMin = 1;
const labelLengthMax = 100;
const labelStateLengthMin = 1;
const descrLengthMin = 10;
const descrLengthMax = 1000;

const schema: any = {
  id: '/ObjectModel',
  type: 'object',
  // required: ['name', 'descr'], // 'version', , "switches", "sensors", "datasets", "media" //, "modelLabels"
  anyOf: [
    {required: ['buttons']},
    {required: ['switches']},
    {required: ['sensors']},
    {required: ['datasets']},
    {required: ['lists']},
    // { "required": ["media"] }
  ],
  additionalProperties: false,
  properties: {
    /* version: {
      type: 'string',
      enum: ['v1'],
    },
    name: {
      properties: {
        en: {
          type: 'string',
          minLength: labelLengthMin,
          maxLength: labelLengthMax,
        },
        de: {
          type: 'string',
          minLength: labelLengthMin,
          maxLength: labelLengthMax,
        },
      },
      required: ['en', 'de'],
    },
    descr: {
      properties: {
        en: {
          type: 'string',
          minLength: descrLengthMin,
          maxLength: descrLengthMax,
        },
        de: {
          type: 'string',
          minLength: descrLengthMin,
          maxLength: descrLengthMax,
        },
      },
      required: ['en', 'de'],
    }, */
    buttons: {
      type: 'object',
      // patternProperties: { "^[a-zA-Z0-9_]*$": { type: "string" } },
      // additionalProperties: {
      maxProperties: 5,
      additionalProperties: false,
      patternProperties: {
        '^[a-zA-Z0-9_]{1,15}$': {
          description: 'Buttons (keys) only alphanumeric with length 5 and ',
          type: 'object',
          additionalProperties: false,
          properties: {
            // actorXX: name + states only
            name: {
              required: ['en', 'de'],
              additionalProperties: false,
              properties: {
                en: {
                  type: 'string',
                  minLength: labelLengthMin,
                  maxLength: labelLengthMax,
                },
                de: {
                  type: 'string',
                  minLength: labelLengthMin,
                  maxLength: labelLengthMax,
                },
              },
            },
            states: {
              type: 'object',
              minProperties: 2, // st1 + st2
              maxProperties: 5,
              additionalProperties: false,
              patternProperties: {
                '^[a-zA-Z0-9_]{1,15}$': {
                  type: 'object',
                  required: ['name', 'color'], // , "task"
                  additionalProperties: false,
                  properties: {
                    name: {
                      required: ['en', 'de'],
                      properties: {
                        en: {
                          type: 'string',
                          minLength: labelStateLengthMin,
                          maxLength: labelLengthMax,
                        },
                        de: {
                          type: 'string',
                          minLength: labelStateLengthMin,
                          maxLength: labelLengthMax,
                        },
                      },
                    },
                    color: {type: 'string'},
                  },
                },
              },
            },
          },
        },
      },
      // minProperties: 1
    },
    switches: {
      type: 'object',
      // patternProperties: { "^[a-zA-Z0-9_]*$": { type: "string" } },
      // additionalProperties: {
      maxProperties: 5,
      additionalProperties: false,
      patternProperties: {
        '^[a-zA-Z0-9_]{1,15}$': {
          description: 'Switches (keys) only alphanumeric with length 5 and ',
          type: 'object',
          additionalProperties: false,
          properties: {
            // actorXX: name + states only
            name: {
              required: ['en', 'de'],
              additionalProperties: false,
              properties: {
                en: {
                  type: 'string',
                  minLength: labelLengthMin,
                  maxLength: labelLengthMax,
                },
                de: {
                  type: 'string',
                  minLength: labelLengthMin,
                  maxLength: labelLengthMax,
                },
              },
            },
            states: {
              type: 'object',
              minProperties: 2, // st1 + st2
              maxProperties: 5,
              additionalProperties: false,
              patternProperties: {
                '^[a-zA-Z0-9_]{1,15}$': {
                  type: 'object',
                  required: ['name', 'color'], // , "task"
                  additionalProperties: false,
                  properties: {
                    name: {
                      required: ['en', 'de'],
                      properties: {
                        en: {
                          type: 'string',
                          minLength: labelStateLengthMin,
                          maxLength: labelLengthMax,
                        },
                        de: {
                          type: 'string',
                          minLength: labelStateLengthMin,
                          maxLength: labelLengthMax,
                        },
                      },
                    },
                    color: {type: 'string'},
                    task: {
                      required: ['name'],
                      properties: {
                        // active: { type: "boolean" },
                        name: {
                          properties: {
                            en: {
                              type: 'string',
                              minLength: labelLengthMin,
                              maxLength: labelLengthMax,
                            },
                            de: {
                              type: 'string',
                              minLength: labelLengthMin,
                              maxLength: labelLengthMax,
                            },
                          },
                          required: ['en', 'de'],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // minProperties: 1
    },
    sensors: {
      type: 'object',
      additionalProperties: false,
      maxProperties: 5,
      patternProperties: {
        '^[a-zA-Z0-9_]{1,15}$': {
          description:
            'Sensors (keys) only alphanumeric with length 1 to 15 and ',
          type: 'object',
          required: ['unit', 'name'],
          additionalProperties: false,
          properties: {
            unit: {type: 'string'},
            name: {
              type: 'object',
              properties: {
                en: {
                  type: 'string',
                  minLength: labelLengthMin,
                  maxLength: labelLengthMax,
                },
                de: {
                  type: 'string',
                  minLength: labelLengthMin,
                  maxLength: labelLengthMax,
                },
              },
            },
          },
        },
      },
      // minProperties: 1
    },
    /* "modelLabels": {
      type: "object",
      properties: {
        en: {"$ref": "/TranslSchema"},
        de: {"$ref": "/TranslSchema"},
      },
      required: ["en", "de"],
      additionalProperties: false
    },*/

    datasets: {
      type: 'object',
      additionalProperties: false,
      maxProperties: 1,
      patternProperties: {
        '^[a-zA-Z0-9_]{1,15}$': {
          type: 'object',
          required: ['frequency'],
          properties: {
            frequency: {
              type: 'string',
              enum: ['hour', 'day', 'minute'],
            },
          },
        },
      },
      /* additionalProperties: {
        type: "object",
      },*/
      // minProperties: 1
    },
    geo: {
      type: 'boolean',
    },
    /*"media": {
      type: "object",
      additionalProperties: {
        type: "object",
      },
      // minProperties: 1
    },*/

    lists: {
      type: 'object',
      additionalProperties: false,
      maxProperties: 5,
      patternProperties: {
        '^[a-zA-Z0-9_]{1,15}$': {
          description:
            'Lists (keys) only alphanumeric with length 1 to 15 and ',
          type: 'object',
          required: ['name'],
          additionalProperties: false,
          properties: {
            name: {
              type: 'object',
              properties: {
                en: {
                  type: 'string',
                  minLength: labelLengthMin,
                  maxLength: labelLengthMax,
                },
                de: {
                  type: 'string',
                  minLength: labelLengthMin,
                  maxLength: labelLengthMax,
                },
              },
            },
          },
        },
      },
      // minProperties: 1
    },
  },
};

const v = new Validator();
// console.log(instance)
// v.addSchema(translSchema, '/TranslSchema');

export const checkSchema = (instance: object) => {
  return v.validate(instance, schema);
};
