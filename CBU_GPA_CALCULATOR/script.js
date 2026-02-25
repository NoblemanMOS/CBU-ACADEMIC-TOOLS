
let courses = [];
let semesters = [];
let gpas = [];
let chart;

function addCourse() {
    let courseName = document.getElementById("courseName").value;
    let credit = parseFloat(document.getElementById("credit").value);
    let type = document.getElementById("courseType").value;
    let grade = document.getElementById("grade").value;

    if (!courseName || !credit) {
        alert("Enter course name and credit");
        return;
    }

    courses.push({ courseName, credit, type, grade });

    let table = document.getElementById("courseTable");
    let row = table.insertRow();
    row.insertCell(0).innerText = courseName;
    row.insertCell(1).innerText = credit;
    row.insertCell(2).innerText = type;
    row.insertCell(3).innerText = grade;
}

function removeCourse() {
    if (courses.length === 0) return;
    courses.pop();
    let table = document.getElementById("courseTable");
    table.deleteRow(table.rows.length - 1);
}

function calculateGPA() {
    let studentName = document.getElementById("studentName").value;
    let programme = document.getElementById("programme").value;

    if (!studentName || !programme) {
        alert("Enter Student Name and Programme");
        return;
    }

    if (courses.length === 0) return;

    let totalWeightedFull = 0, totalCreditsFull = 0;
    let totalWeightedHalf = 0, totalCreditsHalf = 0;
    let classificationPoints = 0;

    courses.forEach(c => {
        let gpa = mapGPA(c.grade);
        let pts = mapDegreePoints(c.grade, c.type);

        if (c.type === "Full") {
            totalWeightedFull += c.credit * gpa;
            totalCreditsFull += c.credit;
        } else {
            totalWeightedHalf += c.credit * gpa;
            totalCreditsHalf += c.credit;
        }

        classificationPoints += pts;
    });

    let GPAFull = totalWeightedFull / Math.max(totalCreditsFull, 1);
    let GPAHalf = totalWeightedHalf / Math.max(totalCreditsHalf, 1);
    let overallGPA = (totalWeightedFull + totalWeightedHalf) / Math.max(totalCreditsFull + totalCreditsHalf, 1);

    semesters.push("Sem " + (semesters.length + 1));
    gpas.push(overallGPA.toFixed(2));

    document.getElementById("studentInfo").innerText =
        `Student: ${studentName} | Programme: ${programme}`;
    document.getElementById("gpaResult").innerText =
        `Overall GPA: ${overallGPA.toFixed(2)} | GPA (Full): ${GPAFull.toFixed(2)} | GPA (Half): ${GPAHalf.toFixed(2)}`;
    document.getElementById("classification").innerText =
        `GPA Classification: ${classifyGPA(overallGPA)}`;
    document.getElementById("classificationPoints").innerText =
        `Total Classification Points: ${classificationPoints.toFixed(1)}`;
    document.getElementById("degreeClassification").innerText =
        `Degree Classification: ${classifyDegree(classificationPoints)}`;

    updateChart();
}

function mapGPA(grade) {
    switch (grade) {
        case "A+": return 5;
        case "A": return 4;
        case "B+": return 3;
        case "B": return 2;
        case "C+": return 1;
        case "C": return 0;
        case "D+": return 1.5;
        case "D": return 1;
        case "F": return 0;
        default: return 0;
    }
}

function mapDegreePoints(grade, type) {
    if (type === "Full") {
        switch (grade) {
            case "A+": return 5;
            case "A": return 4;
            case "B+": return 3;
            case "B": return 2;
            case "C+": return 1;
            case "C": return 0;
            default: return 0;
        }
    } else {
        switch (grade) {
            case "A+": return 2.5;
            case "A": return 2;
            case "B+": return 1.5;
            case "B": return 1;
            case "C+": return 0.5;
            case "C": return 0;
            default: return 0;
        }
    }
}

function classifyGPA(gpa) {
    if (gpa >= 4.5) return "Distinction";
    if (gpa >= 3.5) return "Merit";
    if (gpa >= 2.5) return "Credit";
    if (gpa >= 2) return "Pass";
    return "Fail";
}

function classifyDegree(points) {
    if (points >= 53) return "Distinction";
    if (points >= 38) return "Merit";
    if (points >= 23) return "Credit";
    return "Pass";
}

function updateChart() {
    let ctx = document.getElementById("gpaChart").getContext("2d");
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: semesters,
            datasets: [{
                label: "GPA Trend",
                data: gpas,
                borderColor: "#007bff",
                backgroundColor: "rgba(0,123,255,0.2)",
                fill: false,
                tension: 0.2
            }]
        },
        options: {
            scales: { y: { min: 0, max: 5 } }
        }
    });
}
