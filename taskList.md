## - Create change the data source to json server 
## - Create a nested query
## - Set up a front end that uses the GraphiQL library
## - Test a query, fragment and mutation
 - Refactor code
    ## - Add a mutation to delete a student
    ## - Add a mutation to add a subject
    ## - Add a mutation to delete a subject
    - Add a subscription to a student
    - update with mongoose + promise extension
 - Map out how the react components of GraphiQL are related
 - Describe where each current UI feature is being implemented in the code
  - Local storage is used to... When do we save or remove stuff from local storage
 - Implement one standard customization


Query #1: Nothing nested
{
  student(id: 23) {
    id
    name
  }
}

Query #2: Nested level 1
{
  student(id: 23) {
    id
    class {
      id
      name
    }
  }
}

Query #3: Test for bidirectional flow
{
  student(id: 23) {
    id
    class {
      id
      students{
        id
        class {
          id
        }
      }
    }
  }
}

Fragement #1: 
{
	compsci: class(id: "1") {
    ...classDetails
  }
}

fragment classDetails on Class {
  id
  name
  professor
}

Mutation #1: Sequence when order matters and it would be good to do who back to back

mutation{
  addStudent(id: 11111 name: "Sam", subjectId: "ART321"){
    id
    name
    subject {
      id
    }
  }
}

mutation{
  removeStudent(id: 11111){
    id
    name
    subject {
      id
    }
  }
}