import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '../../../shared/api/apiClient'

export const fetchDashboard = createAsyncThunk('admin/fetchDashboard', async ()=>{
    // try {
    //     const res = await apiClient.get('/admin/dashboard');
    //     return res.data;
    // } catch (error) {
    //     console.error("Failed to fetch dashboard:", error);
    //     throw error;
    // }


    return {
  "components": [
    {
      "type": "stats",
      "data": {
        "courses": 42,
        "faculty": 68,
        "students": 1240,
        "rooms": 320
      }
    },
    {
      "type": "row",
      "data": {
        "children": [
          {
            "type": "pie-chart",
            "span": 4,
            "data": {
              "title": "Room Utilization",
              "data": [
                {
                  "label": "In use",
                  "value": 24
                },
                {
                  "label": "Available",
                  "value": 8
                }
              ]
            }
          },
          {
            "type": "bar-chart",
            "span": 8,
            "data": {
              "title": "Teacher Workload",
              "xKey": "teacher",
              "dataKey": "classes",
              "xLabel": "Teacher",
              "yLabel": "Classes",
              "data": [
                {
                  "teacher": "Dr. Sharma",
                  "classes": 18
                },
                {
                  "teacher": "Dr. Kumar",
                  "classes": 16
                },
                {
                  "teacher": "Dr. Singh",
                  "classes": 14
                },
                 {
                  "teacher": "Dr. Sharma",
                  "classes": 18
                },
                {
                  "teacher": "Dr. Kumar",
                  "classes": 16
                },
                {
                  "teacher": "Dr. Singh",
                  "classes": 14
                },
                 {
                  "teacher": "Dr. Sharma",
                  "classes": 18
                },
                {
                  "teacher": "Dr. Kumar",
                  "classes": 16
                },
                {
                  "teacher": "Dr. Singh",
                  "classes": 14
                },
                 {
                  "teacher": "Dr. Sharma",
                  "classes": 18
                },
                {
                  "teacher": "Dr. Kumar",
                  "classes": 16
                },
                {
                  "teacher": "Dr. Singh",
                  "classes": 14
                },
                 {
                  "teacher": "Dr. Sharma",
                  "classes": 18
                },
                {
                  "teacher": "Dr. Kumar",
                  "classes": 16
                },
                {
                  "teacher": "Dr. Singh",
                  "classes": 14
                }
              ]
            }
          }
        ]
      }
    },

// {
//   "type": "progress",
//   "data": {
//     "title": "Timetable Completion",
//     "current": 38,
//     "total": 42,
//     "description": "4 courses still need scheduling"
//   }
// }, 
{"type": "row",
    "data": {
        "children":[
            {
  "type": "scheduling-status",
  "span": 4,
  "data": {
    "items": [
      {
        "title": "Timetable Completion",
        "current": 38,
        "total": 42,
        "description": "4 courses still need scheduling"
      },
      {
        "title": "Faculty Assignment",
        "current": 64,
        "total": 68,
        "description": "4 faculty members still need assignment"
      },
          {
            "title": "Scheduling Conflicts",
            "value": 3,
            "description": "2 faculty conflicts · 1 room conflict",
            "status": "warning"
          },
          {
            "title": "Unscheduled Courses",
            "value": 4,
            "description": "Courses without a valid timetable slot",
            "status": "warning"
          }
    ]
  }
},
{
 "type": "table",
 "span": 8,
 "data": {
   "title": null,
   "columns": [
     {
       "key": "className",
       "label": "Class"
     },
     {
       "key": "students",
       "label": "Students"
     },
     {
       "key": "courses",
       "label": "Courses"
     },
     {
       "key": "completion",
       "label": "Timetable Completion",
       "format": {
         "type": "progress"
       }
     },
     {
       "key": "status",
       "label": "Status",
       "format": {
         "type": "badge"
       }
     }
   ],
   "rows": [
     {
       "id": 1,
       "className": "CSE-2024-I",
       "students": 62,
       "courses": 8,
       "completion": 100,
       "status": "Complete"
     },
     {
       "id": 2,
       "className": "CSE-2024-II",
       "students": 58,
       "courses": 8,
       "completion": 87,
       "status": "In Progress"
     },
     {
       "id": 3,
       "className": "CSE-2024-III",
       "students": 61,
       "courses": 8,
       "completion": 75,
       "status": "In Progress"
     },
     {
       "id": 4,
       "className": "CSE-2024-IV",
       "students": 60,
       "courses": 8,
       "completion": 100,
       "status": "Complete"
     },
     {
       "id": 5,
       "className": "CSE-2024-V",
       "students": 59,
       "courses": 8,
       "completion": 62,
       "status": "Needs Attention"
     },
      {
       "id": 5,
       "className": "CSE-2024-V",
       "students": 59,
       "courses": 8,
       "completion": 62,
       "status": "Needs Attention"
     },
      {
       "id": 5,
       "className": "CSE-2024-V",
       "students": 59,
       "courses": 8,
       "completion": 62,
       "status": "Needs Attention"
     }
   ]
 }
}
        ]
    },
},


  ]
}
})