import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState("Checking");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: ""
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/employees`);

      if (!response.ok) {
        throw new Error("Unable to load employees");
      }

      const data = await response.json();
      setEmployees(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkDatabase = async () => {
    try {
      const response = await fetch(`${API_URL}/db-health`);

      setDbStatus(response.ok ? "Connected" : "Disconnected");
    } catch {
      setDbStatus("Disconnected");
    }
  };

  useEffect(() => {
    fetchEmployees();
    checkDatabase();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setForm({
        name: "",
        email: "",
        department: ""
      });

      await fetchEmployees();
      await checkDatabase();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your organization's workforce</p>
        </div>

        <span className="platform">
          AWS Containerized Application
        </span>
      </header>

      <main className="container">

        <section className="stats">
          <div className="stat-card">
            <span>Total Employees</span>
            <h2>{employees.length}</h2>
          </div>

          <div className="stat-card">
            <span>Database Status</span>
            <h2 className={
              dbStatus === "Connected" ? "success" : "warning"
            }>
              {dbStatus}
            </h2>
          </div>

          <div className="stat-card">
            <span>Application</span>
            <h2 className="success">Running</h2>
          </div>
        </section>

        <section className="content">

          <div className="panel">
            <h2>Add New Employee</h2>

            <form onSubmit={handleSubmit}>
              <label>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                required
              />

              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />

              <label>Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">Select department</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>

              <button type="submit">
                + Add Employee
              </button>
            </form>
          </div>

          <div className="panel employees">
            <div className="table-header">
              <h2>Employee Directory</h2>

              <button
                className="refresh"
                onClick={fetchEmployees}
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p>Loading employees...</p>
            ) : error ? (
              <p className="warning">{error}</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>
                          <span className="department">
                            {employee.department}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {employees.length === 0 && (
                  <p>No employees found.</p>
                )}
              </div>
            )}
          </div>

        </section>

        <footer>
          Employee Management System | React + Node.js + MySQL
          <br />
          Designed for AWS ECS Fargate deployment
        </footer>

      </main>
    </div>
  );
}

export default App;