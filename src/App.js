import React, { useState, useEffect } from 'react';
import CourseList from './components/CourseList';
import './App.css';

const schedule = {
    "title": "CS Courses for 2018-2019",
    "courses": {
        "F101" : {
            "id" : "F101",
            "meets" : "MWF 11:00-11:50",
            "title" : "Computer Science: Concepts, Philosophy, and Connections"
        },
        "F110" : {
            "id" : "F110",
            "meets" : "MWF 10:00-10:50",
            "title" : "Intro Programming for non-majors"
        },
        "S313" : {
            "id" : "S313",
            "meets" : "TuTh 15:30-16:50",
            "title" : "Tangible Interaction Design and Learning"
        },
        "S314" : {
            "id" : "S314",
            "meets" : "TuTh 9:30-10:50",
            "title" : "Tech & Human Interaction"
        }
    }
};

const App = () => {
    const [schedule, setSchedule] = useState();
    const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';

    useEffect(() => {
        const fetchSchedule = async () => {
            const response = await fetch(url);
            if (!response.ok) throw response;
            const json = await response.json();
            setSchedule(addScheduleTimes(json));
        }
        fetchSchedule();
    }, []);

    if (!schedule) return <h1>Loading schedule...</h1>;

    return (
        <div className="container">
            <Banner title={ schedule.title } />
            <CourseList courses={ schedule.courses } />
        </div>
    );
};

const Banner = props => (
    <h1>{props.title}</h1>
)



const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
    const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
    return !match ? {} : {
        days,
        hours: {
            start: hh1 * 60 + mm1 * 1,
            end: hh2 * 60 + mm2 * 1
        }
    };
};

const mapValues = (fn, obj) => (
    Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
);

const addScheduleTimes = schedule => ({
    title: schedule.title,
    courses: mapValues(addCourseTimes, schedule.courses)
});

const addCourseTimes = course => ({
    ...course,
    ...timeParts(course.meets)
});



export default App;