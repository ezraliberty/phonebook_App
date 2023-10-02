import { useState, useEffect } from "react";
import everyHandle from "./services/persons";

const Filter = ({ handler }) => (
  <div>
    <input onChange={handler} />
  </div>
);

const PersonForm = ({ handler, name, worker, phone, phoneWorker }) => (
  <form onSubmit={handler}>
    <div>
      name: <input value={name} onChange={worker} />
    </div>
    <div>
      Phone Number: <input value={phone} onChange={phoneWorker} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, deleteUser }) => (
  <div>
    {persons.map((person) => (
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deleteUser(person)}>delete</button>
      </p>
    ))}
  </div>
);

const ErrorModal = ({ message, passed }) => {
  if (message === null ) {
    return null;
  }

  return <div className={passed ? "success" : "error"}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("Enter New Name");
  const [newNumber, setNewNumber] = useState("Enter Mobile Number");
  const [findName, setFindName] = useState("");
  const [errorName, setErrorName] = useState(null);
  const [passed, setPassed] = useState(true);

  useEffect(() => {
    everyHandle.everyOne().then((every) => {
      setPersons(every);
    });
  }, []);

  const handleChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setFindName(event.target.value);
  };

  const deleteUser = (name) => {
    if (window.confirm(`Delete ${name.name} ?`)) {
      everyHandle.remove(name.id).then(() => {
        setPersons(persons.filter((p) => p.id !== name.id));
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const checkName = () => {
      const validName = persons.some((person) => person.name === newName);
      if (validName) {
        const user = persons.find((person) => {
          if (person.name === newName) {
            return person;
          }
        });
        const updatedField = { ...user, number: newNumber };
        if (
          window.confirm(
            `${newName} is already added to the phonebook, replace the old number with a new one?`
          )
        ) {
          everyHandle
            .update(updatedField.id, updatedField)
            .then((updatedList) => {
              setPersons(
                persons.map((person) => {
                  if (person.id !== updatedList.id) {
                    return person;
                  } else {
                    setPassed(true);
                    setErrorName(`Updated ${updatedList.name}`);
                    setTimeout(() => {
                      setErrorName(null);
                    }, 5000);
                    return updatedList;
                  }
                })
              );
            })
            .catch((error) => {
              setPassed(false);
              setErrorName(
                `Details of ${updatedField.name} has already been removed from the server`
              );
              setTimeout(() => {
                setErrorName(null);
              }, 5000);
            });
        }
      } else {
        everyHandle.create(newPerson).then((updatedPerson) => {
          setErrorName(`Added ${updatedPerson.name}`);
          setTimeout(() => {
            setErrorName(null);
          }, 5000);
          setPersons(persons.concat(updatedPerson));
        });
      }
    };

    checkName();
    setNewName("");
    setNewNumber("");
  };

  const seen = !findName
    ? persons
    : persons.filter(
        (person) => person.name.toLowerCase() === findName.toLowerCase()
      );

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorModal message={errorName} passed={passed} />
      <Filter handler={handleSearch} />
      <PersonForm
        handler={handleSubmit}
        name={newName}
        worker={handleChange}
        phone={newNumber}
        phoneWorker={handleNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={seen} deleteUser={deleteUser} />
    </div>
  );
};

export default App;
