import React, { useState, useEffect } from 'react';
import CourseList from './components/CourseList';
import './App.css';
import { useData } from './utilities/firebase.js';
import {timeParts} from "./utilities/times";


const App = () => {
    const [schedule, loading, error] = useData('/', addScheduleTimes);

    if (error) return <h1>{error}</h1>;
    if (loading) return <h1>Loading the schedule...</h1>

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