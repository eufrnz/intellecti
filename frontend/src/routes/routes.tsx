import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import RegisterTeacher from "../pages/RegisterTeacher";
import RegisterStudent from "../pages/RegisterStudent";
import Choose from "../pages/Choose";
import TeacherHome from "../pages/TeacherHome";
import StudentHome from "../pages/StudentHome";


export default function AppRoutes() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/register/teacher" element={<RegisterTeacher/>} />
            <Route path="/register/student" element={<RegisterStudent/>} />
            <Route path="/choose" element={<Choose/>} />
            <Route path="/student/home" element={<StudentHome/>} />
            <Route path="/teacher/home" element={<TeacherHome/>} />
        </Routes>
    </BrowserRouter>
    )
}