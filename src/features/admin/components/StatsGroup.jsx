import { Text } from '@mantine/core';
import classes from './StatsGroup.module.css';

export function StatsGroup({
  courses = 0,
  faculty = 0,
  students = 0,
  rooms = 0,
}) {
  const data = [
    {
      title: 'Courses',
      stats: courses,
      description: 'Courses currently scheduled',
    },
    {
      title: 'Faculty',
      stats: faculty,
      description: 'Faculty members in the current academic year',
    },
    {
      title: 'Students',
      stats: students,
      description: 'Students enrolled in the current academic year',
    },
    {
      title: 'Rooms',
      stats: rooms,
      description: 'Rooms available in the current academic year',
    },
  ];

  return (
    <div className={classes.root}>
      {data.map((stat) => (
        <div key={stat.title} className={classes.stat}>
          <Text className={classes.count}>
            {stat.stats}
          </Text>

          <Text className={classes.title}>
            {stat.title}
          </Text>

          <Text className={classes.description}>
            {stat.description}
          </Text>
        </div>
      ))}
    </div>
  );
}

export default StatsGroup;
