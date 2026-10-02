import { useEffect, useState } from "react";
import "./App.css";

/* =========================================================
   DEMO USERS
========================================================= */

const initialUsers = [
  {
    id: "0ewxd0",
    name: "Dr. Sharma",
    email: "doctor@hospital.com",
    password: "doctor123",
    role: "Doctor",
    department: "Cardiology",
    specialization: "Cardiology",
    active: true,
  },
  {
    id: "nurse01",
    name: "Nurse Priya",
    email: "nurse@hospital.com",
    password: "nurse123",
    role: "Nurse",
    department: "General Ward",
    specialization: "",
    active: true,
  },
  {
    id: "rec01",
    name: "Receptionist Anjali",
    email: "reception@hospital.com",
    password: "reception123",
    role: "Receptionist",
    department: "Reception",
    specialization: "",
    active: true,
  },
  {
    id: "admin01",
    name: "Hospital Admin",
    email: "admin@hospital.com",
    password: "admin123",
    role: "Admin",
    department: "Administration",
    specialization: "",
    active: true,
  },
];

/* =========================================================
   INITIAL DEMO PATIENTS
========================================================= */

const initialPatients = [
  {
    id: "P1001",
    name: "Rahul Kumar",
    age: 42,
    phone: "9876543210",

    assignedDoctor: "Dr. Sharma",
    assignedDepartment: "Cardiology",

    complaints: [
      {
        id: 1,
        text: "Fever",
        addedBy: "Receptionist Anjali",
        role: "Receptionist",
        time: "10:05 AM",
      },
      {
        id: 2,
        text: "Cough",
        addedBy: "Nurse Priya",
        role: "Nurse",
        time: "10:18 AM",
      },
    ],

    triage: {
      priority: "Normal",
      notes: "Patient stable.",
      addedBy: "Nurse Priya",
      role: "Nurse",
      time: "10:20 AM",
    },

    vitals: [
      {
        id: 1,
        bp: "140/90",
        temperature: "98.4",
        pulse: "82",
        spo2: "98",
        weight: "76",
        addedBy: "Nurse Priya",
        role: "Nurse",
        time: "10:20 AM",
      },
    ],

    clinical: {
      diagnosis: "Hypertension",
      history: "Previous history of high blood pressure.",
      allergies: "None",
    },

    medications: [
      {
        id: 1,
        medicine: "Amlodipine",
        dose: "5 mg",
        frequency: "Once daily",
        duration: "30 days",
        addedBy: "Dr. Sharma",
        role: "Doctor",
        time: "10:35 AM",
      },
    ],

    doctorNotes: [
      {
        id: 1,
        text: "Regular monitoring recommended.",
        addedBy: "Dr. Sharma",
        role: "Doctor",
        time: "10:36 AM",
      },
    ],

    createdBy: "Receptionist Anjali",
    createdRole: "Receptionist",
    createdAt: "10:05 AM",
  },

  {
    id: "P1002",
    name: "Priya Singh",
    age: 29,
    phone: "9812345678",

    assignedDoctor: "Dr. Sharma",
    assignedDepartment: "General Medicine",

    complaints: [
      {
        id: 1,
        text: "Fever",
        addedBy: "Receptionist Anjali",
        role: "Receptionist",
        time: "11:00 AM",
      },
    ],

    triage: {
      priority: "Normal",
      notes: "Rest and hydration advised.",
      addedBy: "Nurse Priya",
      role: "Nurse",
      time: "11:15 AM",
    },

    vitals: [
      {
        id: 1,
        bp: "118/76",
        temperature: "100.2",
        pulse: "88",
        spo2: "99",
        weight: "58",
        addedBy: "Nurse Priya",
        role: "Nurse",
        time: "11:15 AM",
      },
    ],

    clinical: {
      diagnosis: "Viral Fever",
      history: "No major previous illness.",
      allergies: "Dust",
    },

    medications: [],

    doctorNotes: [
      {
        id: 1,
        text: "Rest and hydration advised.",
        addedBy: "Dr. Sharma",
        role: "Doctor",
        time: "11:30 AM",
      },
    ],

    createdBy: "Receptionist Anjali",
    createdRole: "Receptionist",
    createdAt: "11:00 AM",
  },
];

const initialAppointments = [
  {
    id: 1,
    patientId: "P1001",
    patientName: "Rahul Kumar",
    doctor: "Dr. Sharma",
    department: "Cardiology",
    date: "2026-10-02",
    time: "10:30",
    reason: "Follow-up",
    status: "Scheduled",
  },
];

/* =========================================================
   VALIDATION HELPERS
========================================================= */

function isValidName(name) {
  return /^[A-Za-zÀ-ÿ\s.'-]{2,60}$/.test(
    name.trim()
  );
}

function isValidAge(age) {
  const value = Number(age);
  return (
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 120
  );
}

function isValidIndianMobile(phone) {
  return /^[6-9]\d{9}$/.test(
    phone.trim()
  );
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
}

function isValidBP(bp) {
  const match = bp.trim().match(
    /^(\d{2,3})\/(\d{2,3})$/
  );

  if (!match) return false;

  const systolic = Number(match[1]);
  const diastolic = Number(match[2]);

  return (
    systolic >= 50 &&
    systolic <= 250 &&
    diastolic >= 30 &&
    diastolic <= 150
  );
}

function isValidTemperature(value) {
  const number = Number(value);

  return (
    Number.isFinite(number) &&
    number >= 90 &&
    number <= 110
  );
}

function isValidPulse(value) {
  const number = Number(value);

  return (
    Number.isInteger(number) &&
    number >= 20 &&
    number <= 250
  );
}

function isValidSpO2(value) {
  const number = Number(value);

  return (
    Number.isInteger(number) &&
    number >= 0 &&
    number <= 100
  );
}

function isValidWeight(value) {
  const number = Number(value);

  return (
    Number.isFinite(number) &&
    number > 0 &&
    number <= 500
  );
}

function isValidText(value, min = 1, max = 500) {
  const text = value.trim();

  return (
    text.length >= min &&
    text.length <= max
  );
}

function currentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================================================
   LOGIN
========================================================= */

function LoginPage({
  email,
  password,
  setEmail,
  setPassword,
  onLogin,
}) {
  function submit(e) {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    onLogin();
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Central Hospital EMR</h1>

        <p className="login-subtitle">
          Electronic Medical Record System
        </p>

        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>
        </form>

        <div className="demo-login">
          <p>
            <b>Demo accounts</b>
          </p>

          <p>
            Doctor: doctor@hospital.com / doctor123
          </p>

          <p>
            Nurse: nurse@hospital.com / nurse123
          </p>

          <p>
            Reception: reception@hospital.com / reception123
          </p>

          <p>
            Admin: admin@hospital.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  user,
  currentPage,
  setCurrentPage,
  onLogout,
}) {
  let menu = [];

  if (user.role === "Admin") {
    menu = [
      ["dashboard", "Dashboard"],
      ["users", "Manage Users"],
      ["doctors", "Doctors"],
      ["patients", "Patients"],
      ["appointments", "Appointments"],
      ["departments", "Departments"],
      ["hospital", "Hospital Records"],
    ];
  }

  if (user.role === "Receptionist") {
    menu = [
      ["dashboard", "Dashboard"],
      ["register", "Register Patient"],
      ["patients", "Patients"],
      ["appointments", "Appointments"],
    ];
  }

  if (user.role === "Nurse") {
    menu = [
      ["dashboard", "Dashboard"],
      ["patients", "Patients"],
      ["triage", "Triage Queue"],
      ["vitals", "Vitals"],
    ];
  }

  if (user.role === "Doctor") {
    menu = [
      ["dashboard", "Dashboard"],
      ["patients", "My Patients"],
      ["records", "Medical Records"],
      ["medications", "Medications"],
      ["vitals", "Vitals"],
      ["appointments", "Appointments"],
    ];
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <h2>Central EMR</h2>
        <p>{user.role}</p>
      </div>

      {menu.map(([page, label]) => (
        <button
          key={page}
          className={
            currentPage === page
              ? "sidebar-button active"
              : "sidebar-button"
          }
          onClick={() => setCurrentPage(page)}
        >
          {label}
        </button>
      ))}

      <button
        className="sidebar-button logout-button"
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  );
}

/* =========================================================
   LAYOUT
========================================================= */

function Layout({
  user,
  currentPage,
  setCurrentPage,
  onLogout,
  children,
}) {
  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={onLogout}
      />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h2>
              {currentPage.replace("-", " ")}
            </h2>
          </div>

          <div className="user-info">
            <b>{user.name}</b>
            <span>{user.role}</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  user,
  patients,
  users,
  appointments,
}) {
  const myPatients =
    user.role === "Doctor"
      ? patients.filter(
          (p) =>
            p.assignedDoctor === user.name
        )
      : patients;

  return (
    <div className="page">
      <h1>Welcome, {user.name}</h1>

      <div className="card-grid">
        <div className="dashboard-card">
          <h3>Patients</h3>
          <strong>
            {myPatients.length}
          </strong>
        </div>

        <div className="dashboard-card">
          <h3>Appointments</h3>
          <strong>
            {appointments.length}
          </strong>
        </div>

        {user.role === "Admin" && (
          <div className="dashboard-card">
            <h3>Staff Users</h3>
            <strong>
              {users.length}
            </strong>
          </div>
        )}

        {user.role === "Nurse" && (
          <div className="dashboard-card">
            <h3>Triage Queue</h3>

            <strong>
              {
                patients.filter(
                  (p) => !p.triage
                ).length
              }
            </strong>
          </div>
        )}
      </div>

      <div className="section-card">
        <h2>Your role</h2>

        {user.role === "Receptionist" && (
          <p>
            Register patients, record initial
            complaints, manage appointments and
            assign doctors/departments.
          </p>
        )}

        {user.role === "Nurse" && (
          <p>
            Record symptoms, vitals and triage
            information. Previous entries remain
            unchanged.
          </p>
        )}

        {user.role === "Doctor" && (
          <p>
            Review the complete patient history
            and enter diagnosis, medical history,
            allergies, medicines and clinical notes.
          </p>
        )}

        {user.role === "Admin" && (
          <p>
            Manage hospital users, doctors,
            departments and system information.
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PATIENT LIST
========================================================= */

function PatientsPage({
  patients,
  user,
  onSelectPatient,
  search,
  setSearch,
}) {
  const visiblePatients =
    user.role === "Doctor"
      ? patients.filter(
          (p) =>
            p.assignedDoctor === user.name
        )
      : patients;

  const filtered = visiblePatients.filter(
    (patient) =>
      `${patient.name} ${patient.id} ${patient.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1>Patients</h1>

      <input
        className="search-input"
        placeholder="Search patient..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.phone}</td>
                <td>
                  {patient.assignedDepartment ||
                    "-"}
                </td>
                <td>
                  {patient.assignedDoctor ||
                    "Not assigned"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      onSelectPatient(
                        patient.id
                      )
                    }
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p>No patients found.</p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PATIENT REGISTRATION
========================================================= */

function RegisterPatient({
  onRegister,
}) {
  const [name, setName] =
    useState("");

  const [age, setAge] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [complaint, setComplaint] =
    useState("");

  function submit(e) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanComplaint =
      complaint.trim();

    if (!cleanName) {
      alert("Patient name is required.");
      return;
    }

    if (!isValidName(cleanName)) {
      alert(
        "Please enter a valid patient name. Use letters and spaces only."
      );
      return;
    }

    if (age === "") {
      alert("Age is required.");
      return;
    }

    if (!isValidAge(age)) {
      alert(
        "Age must be a whole number between 0 and 120."
      );
      return;
    }

    if (!cleanPhone) {
      alert("Mobile number is required.");
      return;
    }

    if (!isValidIndianMobile(cleanPhone)) {
      alert(
        "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9."
      );
      return;
    }

    if (!cleanComplaint) {
      alert("Initial complaint is required.");
      return;
    }

    if (!isValidText(cleanComplaint, 2, 200)) {
      alert(
        "Complaint must contain between 2 and 200 characters."
      );
      return;
    }

    onRegister({
      name: cleanName,
      age: Number(age),
      phone: cleanPhone,
      complaint: cleanComplaint,
    });

    setName("");
    setAge("");
    setPhone("");
    setComplaint("");
  }

  return (
    <div className="page">
      <h1>Register Patient</h1>

      <div className="form-card">
        <form onSubmit={submit}>
          <label>
            Patient Name
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Full name"
          />

          <label>Age</label>

          <input
            type="number"
            min="0"
            max="120"
            value={age}
            onChange={(e) =>
              setAge(e.target.value)
            }
          />

          <label>
            Mobile Number
          </label>

          <input
            inputMode="numeric"
            maxLength="10"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            placeholder="10-digit mobile number"
          />

          <label>
            Initial Complaint
          </label>

          <textarea
            value={complaint}
            onChange={(e) =>
              setComplaint(
                e.target.value
              )
            }
            placeholder="Example: Fever"
          />

          <button type="submit">
            Register Patient
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   PATIENT PROFILE
========================================================= */

function PatientProfile({
  patient,
  user,
  onAddComplaint,
  onAddTriage,
  onAddVital,
  onUpdateClinical,
  onAddMedication,
  onAddDoctorNote,
  onAssignDoctor,
  doctors,
}) {
  const [complaint, setComplaint] =
    useState("");

  const [priority, setPriority] =
    useState(
      patient.triage?.priority ||
        "Normal"
    );

  const [triageNotes, setTriageNotes] =
    useState("");

  const [bp, setBp] =
    useState("");

  const [temperature, setTemperature] =
    useState("");

  const [pulse, setPulse] =
    useState("");

  const [spo2, setSpo2] =
    useState("");

  const [weight, setWeight] =
    useState("");

  const [diagnosis, setDiagnosis] =
    useState(
      patient.clinical?.diagnosis ||
        ""
    );

  const [history, setHistory] =
    useState(
      patient.clinical?.history ||
        ""
    );

  const [allergies, setAllergies] =
    useState(
      patient.clinical?.allergies ||
        ""
    );

  const [medicine, setMedicine] =
    useState("");

  const [dose, setDose] =
    useState("");

  const [frequency, setFrequency] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [doctorNote, setDoctorNote] =
    useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState(
      patient.assignedDoctor || ""
    );

  const [selectedDepartment, setSelectedDepartment] =
    useState(
      patient.assignedDepartment || ""
    );

  /* =====================================================
     ADD COMPLAINT
  ===================================================== */

  function addComplaint() {
    const cleanComplaint =
      complaint.trim();

    if (!cleanComplaint) {
      alert(
        user.role === "Nurse"
          ? "Please enter a symptom."
          : "Please enter a complaint."
      );
      return;
    }

    if (
      !isValidText(
        cleanComplaint,
        2,
        200
      )
    ) {
      alert(
        "Entry must contain between 2 and 200 characters."
      );
      return;
    }

    onAddComplaint(
      patient.id,
      cleanComplaint
    );

    setComplaint("");
  }

  /* =====================================================
     TRIAGE
  ===================================================== */

  function addTriage() {
    if (
      ![
        "Normal",
        "Urgent",
        "Emergency",
      ].includes(priority)
    ) {
      alert(
        "Please select a valid triage priority."
      );
      return;
    }

    const cleanNotes =
      triageNotes.trim();

    if (
      cleanNotes &&
      !isValidText(
        cleanNotes,
        2,
        500
      )
    ) {
      alert(
        "Triage notes must contain between 2 and 500 characters."
      );
      return;
    }

    onAddTriage(
      patient.id,
      priority,
      cleanNotes
    );

    setTriageNotes("");
  }

  /* =====================================================
     VITALS
  ===================================================== */

  function addVital() {
    if (
      !bp &&
      !temperature &&
      !pulse &&
      !spo2 &&
      !weight
    ) {
      alert(
        "Enter at least one vital."
      );
      return;
    }

    if (bp && !isValidBP(bp)) {
      alert(
        "Blood Pressure must use a valid format such as 120/80."
      );
      return;
    }

    if (
      temperature &&
      !isValidTemperature(
        temperature
      )
    ) {
      alert(
        "Temperature must be between 90°F and 110°F."
      );
      return;
    }

    if (
      pulse &&
      !isValidPulse(pulse)
    ) {
      alert(
        "Pulse must be a whole number between 20 and 250 BPM."
      );
      return;
    }

    if (
      spo2 &&
      !isValidSpO2(spo2)
    ) {
      alert(
        "SpO₂ must be a whole number between 0 and 100%."
      );
      return;
    }

    if (
      weight &&
      !isValidWeight(weight)
    ) {
      alert(
        "Weight must be between 0 and 500 kg."
      );
      return;
    }

    onAddVital(patient.id, {
      bp: bp.trim(),
      temperature:
        temperature.trim(),
      pulse: pulse.trim(),
      spo2: spo2.trim(),
      weight: weight.trim(),
    });

    setBp("");
    setTemperature("");
    setPulse("");
    setSpo2("");
    setWeight("");
  }

  /* =====================================================
     CLINICAL INFORMATION
  ===================================================== */

  function saveClinical() {
    const cleanDiagnosis =
      diagnosis.trim();

    const cleanHistory =
      history.trim();

    const cleanAllergies =
      allergies.trim();

    if (!cleanDiagnosis) {
      alert(
        "Diagnosis is required."
      );
      return;
    }

    if (
      !isValidText(
        cleanDiagnosis,
        2,
        300
      )
    ) {
      alert(
        "Diagnosis must contain between 2 and 300 characters."
      );
      return;
    }

    if (
      cleanHistory &&
      !isValidText(
        cleanHistory,
        2,
        1000
      )
    ) {
      alert(
        "Medical history must contain between 2 and 1000 characters."
      );
      return;
    }

    if (
      cleanAllergies &&
      !isValidText(
        cleanAllergies,
        2,
        300
      )
    ) {
      alert(
        "Allergies must contain between 2 and 300 characters."
      );
      return;
    }

    onUpdateClinical(
      patient.id,
      {
        diagnosis:
          cleanDiagnosis,
        history:
          cleanHistory,
        allergies:
          cleanAllergies,
      }
    );
  }

  /* =====================================================
     MEDICATION
  ===================================================== */

  function addMedication() {
    const cleanMedicine =
      medicine.trim();

    const cleanDose =
      dose.trim();

    const cleanFrequency =
      frequency.trim();

    const cleanDuration =
      duration.trim();

    if (!cleanMedicine) {
      alert(
        "Medicine name is required."
      );
      return;
    }

    if (!cleanDose) {
      alert("Dose is required.");
      return;
    }

    if (!cleanFrequency) {
      alert(
        "Frequency is required."
      );
      return;
    }

    if (!cleanDuration) {
      alert(
        "Duration is required."
      );
      return;
    }

    if (
      !isValidText(
        cleanMedicine,
        2,
        100
      )
    ) {
      alert(
        "Please enter a valid medicine name."
      );
      return;
    }

    if (
      !isValidText(
        cleanDose,
        1,
        100
      )
    ) {
      alert(
        "Please enter a valid dose."
      );
      return;
    }

    if (
      !isValidText(
        cleanFrequency,
        2,
        100
      )
    ) {
      alert(
        "Please enter a valid frequency."
      );
      return;
    }

    if (
      !isValidText(
        cleanDuration,
        1,
        100
      )
    ) {
      alert(
        "Please enter a valid duration."
      );
      return;
    }

    onAddMedication(
      patient.id,
      {
        medicine:
          cleanMedicine,
        dose: cleanDose,
        frequency:
          cleanFrequency,
        duration:
          cleanDuration,
      }
    );

    setMedicine("");
    setDose("");
    setFrequency("");
    setDuration("");
  }

  /* =====================================================
     DOCTOR NOTE
  ===================================================== */

  function addNote() {
    const cleanNote =
      doctorNote.trim();

    if (!cleanNote) {
      alert(
        "Doctor note cannot be empty."
      );
      return;
    }

    if (
      !isValidText(
        cleanNote,
        2,
        2000
      )
    ) {
      alert(
        "Doctor note must contain between 2 and 2000 characters."
      );
      return;
    }

    onAddDoctorNote(
      patient.id,
      cleanNote
    );

    setDoctorNote("");
  }

  /* =====================================================
     ASSIGN DOCTOR
  ===================================================== */

  function assignDoctor() {
    if (!selectedDoctor) {
      alert(
        "Please select a doctor."
      );
      return;
    }

    if (!selectedDepartment) {
      alert(
        "Please select a department."
      );
      return;
    }

    const doctorExists =
      doctors.some(
        (doctor) =>
          doctor.name ===
          selectedDoctor
      );

    if (!doctorExists) {
      alert(
        "Selected doctor is not available."
      );
      return;
    }

    onAssignDoctor(
      patient.id,
      selectedDoctor,
      selectedDepartment
    );
  }

  return (
    <div className="page">
      <button
        onClick={() =>
          window.history.back()
        }
        className="back-button"
      >
        ← Back
      </button>

      <h1>
        {patient.name} ({patient.id})
      </h1>

      {/* BASIC INFORMATION */}

      <div className="section-card">
        <h2>
          Patient Information
        </h2>

        <div className="info-grid">
          <div>
            <b>Name</b>
            <p>{patient.name}</p>
          </div>

          <div>
            <b>Age</b>
            <p>{patient.age}</p>
          </div>

          <div>
            <b>Mobile</b>
            <p>{patient.phone}</p>
          </div>

          <div>
            <b>Patient ID</b>
            <p>{patient.id}</p>
          </div>

          <div>
            <b>Assigned Doctor</b>
            <p>
              {patient.assignedDoctor ||
                "Not assigned"}
            </p>
          </div>

          <div>
            <b>Department</b>
            <p>
              {patient.assignedDepartment ||
                "Not assigned"}
            </p>
          </div>
        </div>
      </div>

      {/* COMPLAINTS */}

      <div className="section-card">
        <h2>
          Complaints / Symptoms
        </h2>

        <div className="history-list">
          {patient.complaints?.map(
            (item) => (
              <div
                className="history-item"
                key={item.id}
              >
                <div>
                  <strong>
                    {item.text}
                  </strong>
                </div>

                <small>
                  Added by{" "}
                  {item.addedBy} (
                  {item.role}) •{" "}
                  {item.time}
                </small>
              </div>
            )
          )}
        </div>

        {(user.role ===
          "Receptionist" ||
          user.role === "Nurse") && (
          <div className="add-entry">
            <h3>
              Add{" "}
              {user.role ===
              "Nurse"
                ? "Symptom"
                : "Complaint"}
            </h3>

            <textarea
              value={complaint}
              onChange={(e) =>
                setComplaint(
                  e.target.value
                )
              }
              placeholder={
                user.role ===
                "Nurse"
                  ? "Example: Cough"
                  : "Example: Fever"
              }
            />

            <button
              onClick={addComplaint}
            >
              Add Entry
            </button>
          </div>
        )}
      </div>

      {/* NURSE TRIAGE */}

      {user.role === "Nurse" && (
        <div className="section-card">
          <h2>
            Nurse Triage
          </h2>

          <label>
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
          >
            <option>
              Normal
            </option>

            <option>
              Urgent
            </option>

            <option>
              Emergency
            </option>
          </select>

          <label>
            Triage Notes
          </label>

          <textarea
            value={triageNotes}
            onChange={(e) =>
              setTriageNotes(
                e.target.value
              )
            }
            placeholder="Enter triage observations..."
          />

          <button
            onClick={addTriage}
          >
            Save Triage
          </button>
        </div>
      )}

      {/* TRIAGE DISPLAY */}

      {patient.triage && (
        <div className="section-card">
          <h2>
            Triage Information
          </h2>

          <p>
            <b>Priority:</b>{" "}
            {patient.triage.priority}
          </p>

          <p>
            <b>Notes:</b>{" "}
            {patient.triage.notes}
          </p>

          <small>
            Added by{" "}
            {patient.triage.addedBy}{" "}
            (
            {patient.triage.role}
            ) •{" "}
            {patient.triage.time}
          </small>
        </div>
      )}

      {/* VITALS */}

      <div className="section-card">
        <h2>
          Vitals History
        </h2>

        {patient.vitals?.map(
          (vital) => (
            <div
              className="history-item"
              key={vital.id}
            >
              <p>
                <b>BP:</b>{" "}
                {vital.bp || "-"}{" "}
                |{" "}
                <b>
                  Temperature:
                </b>{" "}
                {vital.temperature
                  ? `${vital.temperature} °F`
                  : "-"}{" "}
                |{" "}
                <b>Pulse:</b>{" "}
                {vital.pulse || "-"}{" "}
                |{" "}
                <b>SpO₂:</b>{" "}
                {vital.spo2 || "-"}{" "}
                |{" "}
                <b>Weight:</b>{" "}
                {vital.weight
                  ? `${vital.weight} kg`
                  : "-"}
              </p>

              <small>
                Recorded by{" "}
                {vital.addedBy}{" "}
                (
                {vital.role}
                ) •{" "}
                {vital.time}
              </small>
            </div>
          )
        )}

        {user.role === "Nurse" && (
          <div className="add-entry">
            <h3>
              Record New Vitals
            </h3>

            <input
              placeholder="Blood Pressure e.g. 120/80"
              value={bp}
              onChange={(e) =>
                setBp(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Temperature (°F)"
              value={temperature}
              onChange={(e) =>
                setTemperature(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Pulse (BPM)"
              value={pulse}
              onChange={(e) =>
                setPulse(
                  e.target.value
                )
              }
            />

            <input
              placeholder="SpO₂ (%)"
              value={spo2}
              onChange={(e) =>
                setSpo2(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) =>
                setWeight(
                  e.target.value
                )
              }
            />

            <button
              onClick={addVital}
            >
              Add Vitals
            </button>
          </div>
        )}
      </div>

      {/* RECEPTIONIST ASSIGNMENT */}

      {user.role ===
        "Receptionist" && (
        <div className="section-card">
          <h2>
            Doctor Assignment
          </h2>

          <label>
            Doctor
          </label>

          <select
            value={selectedDoctor}
            onChange={(e) =>
              setSelectedDoctor(
                e.target.value
              )
            }
          >
            <option value="">
              Select Doctor
            </option>

            {doctors.map(
              (doctor) => (
                <option
                  key={doctor.id}
                  value={doctor.name}
                >
                  {doctor.name}
                </option>
              )
            )}
          </select>

          <label>
            Department
          </label>

          <select
            value={selectedDepartment}
            onChange={(e) =>
              setSelectedDepartment(
                e.target.value
              )
            }
          >
            <option value="">
              Select Department
            </option>

            <option>
              Cardiology
            </option>

            <option>
              General Medicine
            </option>

            <option>
              General Ward
            </option>

            <option>
              Orthopedics
            </option>

            <option>
              Pediatrics
            </option>

            <option>
              Emergency
            </option>
          </select>

          <button
            onClick={assignDoctor}
          >
            Assign Doctor
          </button>
        </div>
      )}

      {/* CLINICAL INFORMATION */}

      <div className="section-card">
        <h2>
          Clinical Information
        </h2>

        <div className="audit-box">
          <p>
            <b>Diagnosis:</b>{" "}
            {patient.clinical
              ?.diagnosis ||
              "Not entered"}
          </p>

          <p>
            <b>
              Medical History:
            </b>{" "}
            {patient.clinical
              ?.history ||
              "Not entered"}
          </p>

          <p>
            <b>Allergies:</b>{" "}
            {patient.clinical
              ?.allergies ||
              "Not entered"}
          </p>
        </div>

        {user.role === "Doctor" && (
          <div className="add-entry">
            <h3>
              Doctor Clinical
              Update
            </h3>

            <label>
              Diagnosis
            </label>

            <input
              value={diagnosis}
              onChange={(e) =>
                setDiagnosis(
                  e.target.value
                )
              }
            />

            <label>
              Medical History
            </label>

            <textarea
              value={history}
              onChange={(e) =>
                setHistory(
                  e.target.value
                )
              }
            />

            <label>
              Allergies
            </label>

            <input
              value={allergies}
              onChange={(e) =>
                setAllergies(
                  e.target.value
                )
              }
              placeholder="Enter allergy or None"
            />

            <button
              onClick={
                saveClinical
              }
            >
              Save Clinical
              Information
            </button>
          </div>
        )}
      </div>

      {/* MEDICATIONS */}

      <div className="section-card">
        <h2>
          Medications
        </h2>

        {patient.medications
          ?.length === 0 && (
          <p>
            No medications
            recorded.
          </p>
        )}

        {patient.medications?.map(
          (med) => (
            <div
              className="history-item"
              key={med.id}
            >
              <p>
                <b>
                  {med.medicine}
                </b>
                {" — "}
                {med.dose} —{" "}
                {med.frequency} —{" "}
                {med.duration}
              </p>

              <small>
                Added by{" "}
                {med.addedBy} (
                {med.role}) •{" "}
                {med.time}
              </small>
            </div>
          )
        )}

        {user.role === "Doctor" && (
          <div className="add-entry">
            <h3>
              Add Medication
            </h3>

            <input
              placeholder="Medicine"
              value={medicine}
              onChange={(e) =>
                setMedicine(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Dose e.g. 5 mg"
              value={dose}
              onChange={(e) =>
                setDose(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Frequency e.g. Once daily"
              value={frequency}
              onChange={(e) =>
                setFrequency(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Duration e.g. 30 days"
              value={duration}
              onChange={(e) =>
                setDuration(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                addMedication
              }
            >
              Add Medication
            </button>
          </div>
        )}
      </div>

      {/* DOCTOR NOTES */}

      <div className="section-card">
        <h2>
          Doctor Notes
        </h2>

        {patient.doctorNotes?.map(
          (note) => (
            <div
              className="history-item"
              key={note.id}
            >
              <p>
                {note.text}
              </p>

              <small>
                Written by{" "}
                {note.addedBy} (
                {note.role}) •{" "}
                {note.time}
              </small>
            </div>
          )
        )}

        {user.role === "Doctor" && (
          <div className="add-entry">
            <h3>
              Add Doctor Note
            </h3>

            <textarea
              value={doctorNote}
              onChange={(e) =>
                setDoctorNote(
                  e.target.value
                )
              }
              placeholder="Enter clinical note..."
            />

            <button
              onClick={addNote}
            >
              Add Note
            </button>
          </div>
        )}
      </div>

      {/* AUDIT SUMMARY */}

      <div className="section-card">
        <h2>
          Record History
        </h2>

        <p>
          <b>
            Patient registered by:
          </b>{" "}
          {patient.createdBy} (
          {patient.createdRole}) •{" "}
          {patient.createdAt}
        </p>

        <p>
          This record preserves
          previous entries and
          identifies the staff
          member who added them.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN - USERS
========================================================= */

function ManageUsers({
  users,
  onCreateUser,
  onEditUser,
  onToggleStatus,
}) {
  const [showForm, setShowForm] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  return (
    <div className="page">
      <div className="page-header">
        <h1>
          Manage Users
        </h1>

        <button
          onClick={() =>
            setShowForm(true)
          }
        >
          + Create User
        </button>
      </div>

      {showForm && (
        <UserForm
          onSave={(data) => {
            const success =
              onCreateUser(data);

            if (success) {
              setShowForm(false);
            }
          }}
          onCancel={() =>
            setShowForm(false)
          }
        />
      )}

      {editingUser && (
        <UserForm
          existingUser={
            editingUser
          }
          onSave={(data) => {
            const success =
              onEditUser(data);

            if (success) {
              setEditingUser(null);
            }
          }}
          onCancel={() =>
            setEditingUser(null)
          }
        />
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.name}
                </td>

                <td>
                  {user.email}
                </td>

                <td>
                  {user.role}
                </td>

                <td>
                  {user.department}
                </td>

                <td>
                  {user.active
                    ? "Active"
                    : "Disabled"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      setEditingUser(
                        user
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onToggleStatus(
                        user.id
                      )
                    }
                  >
                    {user.active
                      ? "Disable"
                      : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   USER FORM
========================================================= */

function UserForm({
  existingUser,
  onSave,
  onCancel,
}) {
  const [name, setName] =
    useState(
      existingUser?.name || ""
    );

  const [email, setEmail] =
    useState(
      existingUser?.email || ""
    );

  const [password, setPassword] =
    useState(
      existingUser?.password || ""
    );

  const [role, setRole] =
    useState(
      existingUser?.role ||
        "Doctor"
    );

  const [department, setDepartment] =
    useState(
      existingUser?.department ||
        ""
    );

  const [specialization, setSpecialization] =
    useState(
      existingUser?.specialization ||
        ""
    );

  function submit(e) {
    e.preventDefault();

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPassword =
      password.trim();

    const cleanDepartment =
      department.trim();

    const cleanSpecialization =
      specialization.trim();

    if (!cleanName) {
      alert(
        "User name is required."
      );
      return;
    }

    if (!isValidName(cleanName)) {
      alert(
        "Please enter a valid user name."
      );
      return;
    }

    if (!cleanEmail) {
      alert(
        "Email is required."
      );
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      alert(
        "Please enter a valid email address."
      );
      return;
    }

    if (!cleanPassword) {
      alert(
        "Password is required."
      );
      return;
    }

    if (cleanPassword.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      ![
        "Doctor",
        "Nurse",
        "Receptionist",
        "Admin",
      ].includes(role)
    ) {
      alert(
        "Please select a valid role."
      );
      return;
    }

    if (!cleanDepartment) {
      alert(
        "Department is required."
      );
      return;
    }

    if (
      cleanDepartment.length >
      100
    ) {
      alert(
        "Department name is too long."
      );
      return;
    }

    if (
      cleanSpecialization.length >
      100
    ) {
      alert(
        "Specialization is too long."
      );
      return;
    }

    onSave({
      id:
        existingUser?.id ||
        Date.now(),

      name: cleanName,

      email: cleanEmail,

      password:
        cleanPassword,

      role,

      department:
        cleanDepartment,

      specialization:
        cleanSpecialization,

      active:
        existingUser?.active ??
        true,
    });
  }

  return (
    <div className="form-card">
      <h2>
        {existingUser
          ? "Edit User"
          : "Create User"}
      </h2>

      <form onSubmit={submit}>
        <label>
          Name
        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <label>
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <label>
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <label>
          Role
        </label>

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
        >
          <option>
            Doctor
          </option>

          <option>
            Nurse
          </option>

          <option>
            Receptionist
          </option>

          <option>
            Admin
          </option>
        </select>

        <label>
          Department
        </label>

        <input
          value={department}
          onChange={(e) =>
            setDepartment(
              e.target.value
            )
          }
        />

        <label>
          Specialization
        </label>

        <input
          value={specialization}
          onChange={(e) =>
            setSpecialization(
              e.target.value
            )
          }
        />

        <button type="submit">
          {existingUser
            ? "Save Changes"
            : "Create User"}
        </button>

        <button
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

/* =========================================================
   DOCTORS
========================================================= */

function DoctorsPage({
  users,
}) {
  const doctors =
    users.filter(
      (user) =>
        user.role === "Doctor"
    );

  return (
    <div className="page">
      <h1>
        Doctors
      </h1>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Specialization</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map(
              (doctor) => (
                <tr
                  key={doctor.id}
                >
                  <td>
                    {doctor.name}
                  </td>

                  <td>
                    {doctor.department}
                  </td>

                  <td>
                    {doctor.specialization ||
                      "Not specified"}
                  </td>

                  <td>
                    {doctor.active
                      ? "Active"
                      : "Disabled"}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   APPOINTMENTS
========================================================= */

function AppointmentsPage({
  appointments,
  patients,
  doctors,
  user,
  onAddAppointment,
  onUpdateStatus,
}) {
  const [patientId, setPatientId] =
    useState("");

  const [doctor, setDoctor] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [reason, setReason] =
    useState("");

  function submit(e) {
    e.preventDefault();

    if (!patientId) {
      alert(
        "Please select a patient."
      );
      return;
    }

    if (!doctor) {
      alert(
        "Please select a doctor."
      );
      return;
    }

    if (!department.trim()) {
      alert(
        "Department is required."
      );
      return;
    }

    if (!date) {
      alert(
        "Please select an appointment date."
      );
      return;
    }

    if (!time) {
      alert(
        "Please select an appointment time."
      );
      return;
    }

    if (!reason.trim()) {
      alert(
        "Appointment reason is required."
      );
      return;
    }

    if (
      !isValidText(
        reason,
        2,
        200
      )
    ) {
      alert(
        "Appointment reason must contain between 2 and 200 characters."
      );
      return;
    }

    const patient =
      patients.find(
        (p) =>
          p.id === patientId
      );

    if (!patient) {
      alert(
        "Selected patient was not found."
      );
      return;
    }

    const doctorExists =
      doctors.some(
        (d) =>
          d.name === doctor
      );

    if (!doctorExists) {
      alert(
        "Selected doctor is not available."
      );
      return;
    }

    onAddAppointment({
      patientId,
      patientName:
        patient.name,
      doctor,
      department:
        department.trim(),
      date,
      time,
      reason:
        reason.trim(),
      status:
        "Scheduled",
    });

    setPatientId("");
    setDoctor("");
    setDepartment("");
    setDate("");
    setTime("");
    setReason("");
  }

  return (
    <div className="page">
      <h1>
        Appointments
      </h1>

      {(user.role ===
        "Receptionist" ||
        user.role ===
          "Admin") && (
        <div className="form-card">
          <h2>
            Create Appointment
          </h2>

          <form
            onSubmit={submit}
          >
            <label>
              Patient
            </label>

            <select
              value={patientId}
              onChange={(e) =>
                setPatientId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Patient
              </option>

              {patients.map(
                (p) => (
                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.name} (
                    {p.id})
                  </option>
                )
              )}
            </select>

            <label>
              Doctor
            </label>

            <select
              value={doctor}
              onChange={(e) =>
                setDoctor(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Doctor
              </option>

              {doctors.map(
                (d) => (
                  <option
                    key={d.id}
                    value={d.name}
                  >
                    {d.name}
                  </option>
                )
              )}
            </select>

            <label>
              Department
            </label>

            <input
              value={department}
              onChange={(e) =>
                setDepartment(
                  e.target.value
                )
              }
            />

            <label>
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
            />

            <label>
              Time
            </label>

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(
                  e.target.value
                )
              }
            />

            <label>
              Reason
            </label>

            <input
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              placeholder="Example: Follow-up"
            />

            <button type="submit">
              Create Appointment
            </button>
          </form>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>
                Patient
              </th>
              <th>
                Doctor
              </th>
              <th>
                Department
              </th>
              <th>Date</th>
              <th>Time</th>
              <th>
                Reason
              </th>
              <th>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {appointments.map(
              (appointment) => (
                <tr
                  key={
                    appointment.id
                  }
                >
                  <td>
                    {
                      appointment.patientName
                    }
                  </td>

                  <td>
                    {
                      appointment.doctor
                    }
                  </td>

                  <td>
                    {
                      appointment.department
                    }
                  </td>

                  <td>
                    {
                      appointment.date
                    }
                  </td>

                  <td>
                    {
                      appointment.time
                    }
                  </td>

                  <td>
                    {
                      appointment.reason
                    }
                  </td>

                  <td>
                    <select
                      value={
                        appointment.status
                      }
                      onChange={(
                        e
                      ) =>
                        onUpdateStatus(
                          appointment.id,
                          e.target.value
                        )
                      }
                    >
                      <option>
                        Scheduled
                      </option>

                      <option>
                        Completed
                      </option>

                      <option>
                        Cancelled
                      </option>
                    </select>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   SIMPLE ADMIN PAGES
========================================================= */

function SimplePage({
  title,
  text,
}) {
  return (
    <div className="page">
      <h1>{title}</h1>

      <div className="section-card">
        <p>{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((response) => response.json())
      .then((data) => {
        setBackendMessage(data.message);
      })
      .catch((error) => {
        console.error("Backend connection failed:", error);
      });
  }, []);
  const [users, setUsers] =
    useState(initialUsers);

  const [patients, setPatients] =
    useState(initialPatients);

  const [appointments, setAppointments] =
    useState(initialAppointments);

  const [loggedInUser, setLoggedInUser] =
    useState(null);

  const [loginEmail, setLoginEmail] =
    useState("");

  const [loginPassword, setLoginPassword] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [selectedPatientId, setSelectedPatientId] =
    useState(null);

  const [patientSearch, setPatientSearch] =
    useState("");

  /* =====================================================
     LOGIN
  ===================================================== */

  function handleLogin() {
    const cleanEmail =
      loginEmail
        .trim()
        .toLowerCase();

    const user =
      users.find(
        (u) =>
          u.email
            .toLowerCase() ===
            cleanEmail &&
          u.password ===
            loginPassword &&
          u.active
      );

    if (!user) {
      alert(
        "Invalid login details or account is disabled."
      );
      return;
    }

    setLoggedInUser(user);
    setLoginEmail("");
    setLoginPassword("");
    setCurrentPage(
      "dashboard"
    );
  }

  function handleLogout() {
    setLoggedInUser(null);
    setCurrentPage(
      "dashboard"
    );
    setSelectedPatientId(
      null
    );
  }

  /* =====================================================
     USER MANAGEMENT
  ===================================================== */

  function handleCreateUser(
    newUserData
  ) {
    const exists =
      users.some(
        (u) =>
          u.email.toLowerCase() ===
          newUserData.email.toLowerCase()
      );

    if (exists) {
      alert(
        "A user with this email already exists."
      );
      return false;
    }

    setUsers(
      (previous) => [
        ...previous,
        {
          ...newUserData,
          id: Date.now(),
          active: true,
        },
      ]
    );

    alert(
      "User created successfully."
    );

    return true;
  }

  function handleEditUser(
    updatedUser
  ) {
    const duplicate =
      users.some(
        (user) =>
          user.id !==
            updatedUser.id &&
          user.email.toLowerCase() ===
            updatedUser.email.toLowerCase()
      );

    if (duplicate) {
      alert(
        "Another user already uses this email."
      );
      return false;
    }

    setUsers(
      (previous) =>
        previous.map(
          (user) =>
            user.id ===
            updatedUser.id
              ? updatedUser
              : user
        )
    );

    alert(
      "User updated successfully."
    );

    return true;
  }

  function toggleUserStatus(
    userId
  ) {
    setUsers(
      (previous) =>
        previous.map(
          (user) =>
            user.id === userId
              ? {
                  ...user,
                  active:
                    !user.active,
                }
              : user
        )
    );
  }

  /* =====================================================
     REGISTER PATIENT
  ===================================================== */

  function registerPatient({
    name,
    age,
    phone,
    complaint,
  }) {
    const newPatient = {
      id: `P${
        1000 +
        patients.length +
        1
      }`,

      name,
      age,
      phone,

      assignedDoctor: "",
      assignedDepartment: "",

      complaints: [
        {
          id: Date.now(),
          text: complaint,
          addedBy:
            loggedInUser.name,
          role:
            loggedInUser.role,
          time: currentTime(),
        },
      ],

      triage: null,

      vitals: [],

      clinical: {
        diagnosis: "",
        history: "",
        allergies: "",
      },

      medications: [],

      doctorNotes: [],

      createdBy:
        loggedInUser.name,

      createdRole:
        loggedInUser.role,

      createdAt:
        currentTime(),
    };

    setPatients(
      (previous) => [
        ...previous,
        newPatient,
      ]
    );

    alert(
      `Patient registered successfully.\nPatient ID: ${newPatient.id}`
    );
  }

  /* =====================================================
     ADD COMPLAINT
  ===================================================== */

  function addComplaint(
    patientId,
    complaint
  ) {
    if (
      loggedInUser.role !==
        "Receptionist" &&
      loggedInUser.role !==
        "Nurse"
    ) {
      alert(
        "You do not have permission to add complaints or symptoms."
      );
      return;
    }

    if (
      !isValidText(
        complaint,
        2,
        200
      )
    ) {
      alert(
        "Complaint/symptom must contain between 2 and 200 characters."
      );
      return;
    }

    setPatients(
      (previous) =>
        previous.map(
          (patient) => {
            if (
              patient.id !==
              patientId
            ) {
              return patient;
            }

            return {
              ...patient,

              complaints: [
                ...(patient.complaints ||
                  []),

                {
                  id: Date.now(),
                  text: complaint,
                  addedBy:
                    loggedInUser.name,
                  role:
                    loggedInUser.role,
                  time: currentTime(),
                },
              ],
            };
          }
        )
    );
  }

  /* =====================================================
     ADD TRIAGE
  ===================================================== */

  function addTriage(
    patientId,
    priority,
    notes
  ) {
    if (
      loggedInUser.role !==
      "Nurse"
    ) {
      alert(
        "Only nurses can enter triage information."
      );
      return;
    }

    if (
      ![
        "Normal",
        "Urgent",
        "Emergency",
      ].includes(priority)
    ) {
      alert(
        "Invalid triage priority."
      );
      return;
    }

    setPatients(
      (previous) =>
        previous.map(
          (patient) => {
            if (
              patient.id !==
              patientId
            ) {
              return patient;
            }

            return {
              ...patient,

              triage: {
                priority,
                notes:
                  notes ||
                  "No additional triage notes.",
                addedBy:
                  loggedInUser.name,
                role:
                  loggedInUser.role,
                time: currentTime(),
              },
            };
          }
        )
    );

    alert(
      "Triage information saved."
    );
  }

  /* =====================================================
     ADD VITAL
  ===================================================== */

  function addVital(
    patientId,
    vitalData
  ) {
    if (
      loggedInUser.role !==
      "Nurse"
    ) {
      alert(
        "Only nurses can record vitals."
      );
      return;
    }

    if (
      vitalData.bp &&
      !isValidBP(
        vitalData.bp
      )
    ) {
      alert(
        "Invalid blood pressure."
      );
      return;
    }

    if (
      vitalData.temperature &&
      !isValidTemperature(
        vitalData.temperature
      )
    ) {
      alert(
        "Invalid temperature."
      );
      return;
    }

    if (
      vitalData.pulse &&
      !isValidPulse(
        vitalData.pulse
      )
    ) {
      alert(
        "Invalid pulse."
      );
      return;
    }

    if (
      vitalData.spo2 &&
      !isValidSpO2(
        vitalData.spo2
      )
    ) {
      alert(
        "Invalid SpO₂ value."
      );
      return;
    }

    if (
      vitalData.weight &&
      !isValidWeight(
        vitalData.weight
      )
    ) {
      alert(
        "Invalid weight."
      );
      return;
    }

    setPatients(
      (previous) =>
        previous.map(
          (patient) => {
            if (
              patient.id !==
              patientId
            ) {
              return patient;
            }

            return {
              ...patient,

              vitals: [
                ...(patient.vitals ||
                  []),

                {
                  id: Date.now(),
                  ...vitalData,
                  addedBy:
                    loggedInUser.name,
                  role:
                    loggedInUser.role,
                  time: currentTime(),
                },
              ],
            };
          }
        )
    );

    alert(
      "Vitals added successfully."
    );
  }

  /* =====================================================
     DOCTOR CLINICAL INFORMATION
  ===================================================== */

  function updateClinical(
    patientId,
    clinicalData
  ) {
    if (
      loggedInUser.role !==
      "Doctor"
    ) {
      alert(
        "Only doctors can update clinical information."
      );
      return;
    }

    if (
      !clinicalData.diagnosis ||
      !clinicalData.diagnosis.trim()
    ) {
      alert(
        "Diagnosis is required."
      );
      return;
    }

    setPatients(
      (previous) =>
        previous.map(
          (patient) => {
            if (
              patient.id !==
              patientId
            ) {
              return patient;
            }

            return {
              ...patient,

              clinical: {
                ...patient.clinical,
                ...clinicalData,
              },
            };
          }
        )
    );

    alert(
      "Clinical information updated by doctor."
    );
  }

  /* =====================================================
     ADD MEDICATION
  ===================================================== */

  function addMedication(
    patientId,
    medicationData
  ) {
    if (
      loggedInUser.role !==
      "Doctor"
    ) {
      alert(
        "Only doctors can add medications."
      );
      return;
    }

    if (
      !medicationData.medicine ||
      !medicationData.dose ||
      !medicationData.frequency ||
      !medicationData.duration
    ) {
      alert(
        "All medication fields are required."
      );
      return;
    }

    setPatients(
      (previous) =>
        previous.map(
          (patient) => {
            if (
              patient.id !==
              patientId
            ) {
              return patient;
            }

            return {
              ...patient,

              medications: [
                ...(patient.medications ||
                  []),

                {
                  id: Date.now(),
                  ...medicationData,
                  addedBy:
                    loggedInUser.name,
                  role:
                    loggedInUser.role,
                  time: currentTime(),
                },
              ],
            };
          }
        )
    );

    alert(
      "Medication added."
    );
  }

  /* =====================================================
     ADD DOCTOR NOTE
  ===================================================== */

  function addDoctorNote(
    patientId,
    note
  ) {
    if (
      loggedInUser.role !==
      "Doctor"
    ) {
      alert(
        "Only doctors can add doctor notes."
      );
      return;
    }

    if (
      !isValidText(
        note,
        2,
        2000
      )
    ) {
      alert(
        "Doctor note must contain between 2 and 2000 characters."
      );
      return;
    }

    setPatients(
      (previous) =>
        previous.map(
          (patient) => {
            if (
              patient.id !==
              patientId
            ) {
              return patient;
            }

            return {
              ...patient,

              doctorNotes: [
                ...(patient.doctorNotes ||
                  []),

                {
                  id: Date.now(),
                  text: note,
                  addedBy:
                    loggedInUser.name,
                  role:
                    loggedInUser.role,
                  time: currentTime(),
                },
              ],
            };
          }
        )
    );

    alert(
      "Doctor note added."
    );
  }

  /* =====================================================
     ASSIGN DOCTOR
  ===================================================== */

  function assignDoctor(
    patientId,
    doctor,
    department
  ) {
    if (
      loggedInUser.role !==
      "Receptionist"
    ) {
      alert(
        "Only receptionists can assign doctors."
      );
      return;
    }

    if (!doctor) {
      alert(
        "Please select a doctor."
      );
      return;
    }

    if (!department) {
      alert(
        "Please select a department."
      );
      return;
    }

    setPatients(
      (previous) =>
        previous.map(
          (patient) =>
            patient.id ===
            patientId
              ? {
                  ...patient,
                  assignedDoctor:
                    doctor,
                  assignedDepartment:
                    department,
                }
              : patient
        )
    );

    alert(
      "Doctor and department assigned successfully."
    );
  }

  /* =====================================================
     APPOINTMENT
  ===================================================== */

  function addAppointment(
    data
  ) {
    if (
      !data.patientId ||
      !data.doctor ||
      !data.department ||
      !data.date ||
      !data.time ||
      !data.reason
    ) {
      alert(
        "Please complete all appointment fields."
      );
      return;
    }

    setAppointments(
      (previous) => [
        ...previous,

        {
          ...data,
          id: Date.now(),
        },
      ]
    );

    alert(
      "Appointment created."
    );
  }

  function updateAppointmentStatus(
    appointmentId,
    status
  ) {
    const allowedStatuses = [
      "Scheduled",
      "Completed",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      alert(
        "Invalid appointment status."
      );
      return;
    }

    setAppointments(
      (previous) =>
        previous.map(
          (appointment) =>
            appointment.id ===
            appointmentId
              ? {
                  ...appointment,
                  status,
                }
              : appointment
        )
    );
  }

  /* =====================================================
     LOGIN SCREEN
  ===================================================== */

  if (!loggedInUser) {
    return (
      <LoginPage
        email={loginEmail}
        password={loginPassword}
        setEmail={setLoginEmail}
        setPassword={
          setLoginPassword
        }
        onLogin={handleLogin}
      />
    );
  }

  /* =====================================================
     SELECTED PATIENT
  ===================================================== */

  const selectedPatient =
    patients.find(
      (patient) =>
        patient.id ===
        selectedPatientId
    );

  /* =====================================================
     DOCTORS
  ===================================================== */

  const doctors =
    users.filter(
      (user) =>
        user.role ===
          "Doctor" &&
        user.active
    );

  /* =====================================================
     PAGE RENDERING
  ===================================================== */

  function renderPage() {
    if (
      selectedPatient &&
      currentPage ===
        "patient-info"
    ) {
      return (
        <PatientProfile
          patient={
            selectedPatient
          }
          user={
            loggedInUser
          }
          doctors={doctors}
          onAddComplaint={
            addComplaint
          }
          onAddTriage={
            addTriage
          }
          onAddVital={
            addVital
          }
          onUpdateClinical={
            updateClinical
          }
          onAddMedication={
            addMedication
          }
          onAddDoctorNote={
            addDoctorNote
          }
          onAssignDoctor={
            assignDoctor
          }
        />
      );
    }

    if (
      currentPage ===
      "dashboard"
    ) {
      return (
        <Dashboard
          user={
            loggedInUser
          }
          patients={
            patients
          }
          users={users}
          appointments={
            appointments
          }
        />
      );
    }

    if (
      currentPage ===
      "patients"
    ) {
      return (
        <PatientsPage
          patients={
            patients
          }
          user={
            loggedInUser
          }
          search={
            patientSearch
          }
          setSearch={
            setPatientSearch
          }
          onSelectPatient={(
            id
          ) => {
            setSelectedPatientId(
              id
            );

            setCurrentPage(
              "patient-info"
            );
          }}
        />
      );
    }

    if (
      currentPage ===
      "register"
    ) {
      return (
        <RegisterPatient
          onRegister={
            registerPatient
          }
        />
      );
    }

    if (
      currentPage ===
      "users"
    ) {
      return (
        <ManageUsers
          users={users}
          onCreateUser={
            handleCreateUser
          }
          onEditUser={
            handleEditUser
          }
          onToggleStatus={
            toggleUserStatus
          }
        />
      );
    }

    if (
      currentPage ===
      "doctors"
    ) {
      return (
        <DoctorsPage
          users={users}
        />
      );
    }

    if (
      currentPage ===
      "appointments"
    ) {
      return (
        <AppointmentsPage
          appointments={
            appointments
          }
          patients={
            patients
          }
          doctors={doctors}
          user={
            loggedInUser
          }
          onAddAppointment={
            addAppointment
          }
          onUpdateStatus={
            updateAppointmentStatus
          }
        />
      );
    }

    if (
      currentPage ===
      "triage"
    ) {
      return (
        <PatientsPage
          patients={patients.filter(
            (p) => !p.triage
          )}
          user={
            loggedInUser
          }
          search={
            patientSearch
          }
          setSearch={
            setPatientSearch
          }
          onSelectPatient={(
            id
          ) => {
            setSelectedPatientId(
              id
            );

            setCurrentPage(
              "patient-info"
            );
          }}
        />
      );
    }

    if (
      currentPage ===
      "records"
    ) {
      return (
        <SimplePage
          title="Medical Records"
          text="Open a patient from My Patients to view the complete medical record."
        />
      );
    }

    if (
      currentPage ===
      "medications"
    ) {
      return (
        <SimplePage
          title="Medications"
          text="Medication records are maintained inside each patient's medical profile and show who added each medication."
        />
      );
    }

    if (
      currentPage ===
      "vitals"
    ) {
      return (
        <SimplePage
          title="Vitals"
          text="Nurses can record new vitals. Previous vital readings remain stored in the patient's history."
        />
      );
    }

    if (
      currentPage ===
      "departments"
    ) {
      return (
        <SimplePage
          title="Departments"
          text="Hospital departments can be managed here. Department management will later be connected to the backend."
        />
      );
    }

    if (
      currentPage ===
      "hospital"
    ) {
      return (
        <SimplePage
          title="Hospital Records"
          text="Hospital-wide system records, configuration and audit information will be managed here."
        />
      );
    }

    return (
      <Dashboard
        user={
          loggedInUser
        }
        patients={
          patients
        }
        users={users}
        appointments={
          appointments
        }
      />
    );
  }

  return (
    <Layout
      user={
        loggedInUser
      }
      currentPage={
        currentPage
      }
      setCurrentPage={(
        page
      ) =>
        {
        setSelectedPatientId(
          null
        );

        setCurrentPage(
          page
        );
      }}
      onLogout={
        handleLogout
      }
    >
      <p>{backendMessage}</p>
      {renderPage()}
    </Layout>
  );
}