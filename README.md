# Exercise Instructions

The purpose of this exercise is to test your nodejs coding skills, and your logical thinking.

1. Write Clean an easy to read code
2. Take runtime and memory optimization into consideration
3. Think about potential edge cases that might affect your solution
4. Use best practices and design patterns both in your code structure and in your solution architecture

The entire task should take about 4 hours.
If the coding level is sufficiant, we will go over the code in a 1 on 1 interview.
Feel free to send questions / ask for clarifications to yoni@beamup.ai

## Submission

1. Submit an archive of your solution via mail to yoni@beamup.ai
2. Title the email as Nodejs Exercise Submission - your email
3. State you name, email phone number in the content of the email

# Exersize description

BeamUps uses complex data models do describe architectural structures. To allow data unity across our entire application, we use a format called Avro to format our data. In this Exercise we will be using a simplified Avro model:

Our Avro models are defined in .avsc files (inside the schemes folder) which are JSON like schema descriptions.
Each file defines a single model type (based on the file name), for Example: The point.avsc file, describes a model of type point.

Each model has a name and a list of fields. Each field can be of several types:

Primitive types: int, float, long, string, boolean
Complex types: array, record, and schema references

For example:

A point contains only primitive type fields
A Line contains a complex type 'start': point, and 'end': point.
A Room contains an array of references named 'boundaryPoints'
A Level contains a complex record named 'architect'

The objective of this exercise is to create an Avro parser that can read model definitions, and validate their structure.

Example data can be found under the data folder.

# Tasks

1. Create a service named BMD. The service gets a folder_path parameter at initialization, and is able to read "schemes" from the specified folder and perform various operations. Due to the potentially large size of different schemes, this service should only be loaded into memory once, but still allow usage by different parts of the application.

2. Create a function named get_schema in the BMD service, that accepts a schema_type and returns a complete INDEPENDENT Schema of a specific type. The schema should contain only primitive value types, arrays and objects, but no model references.

3. Create a function named validate(schema_type, schema_dict) in the BMD service , that accepts a schema_type and schema_dict, and validates the current dictionary against the schema. Assume all schema fields are required, and no undefined fields can be present.

4. Improve the validate function performance by leveraging parallel execution

5. Bonus: Dockerise the solution so that one can deploy a docker image with the BMD service available to be used in any js code.
