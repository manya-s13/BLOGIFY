import Chart from "../components/Chart";
import { useState, useEffect } from "react";
import axios from 'axios';

const Admin = () =>{
    const [userSignups, setUserSignups] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(()=>{
        const fetchData = async()=>{
            const userData = await axios.get('http://localhost:4001/api/analysis/signups');
            const blogData = await axios.get('http://localhost:4001/api/analysis/getblogs');

            setUserSignups(userData.data);
            setBlogPosts(blogData.data);

        };
        fetchData();
    }, []);


    return (
        <div>
            <div className="text-center mt-4 font-semibold" >Users signed up per month</div>
          <Chart
            options={{
              chart: { id: 'user-signups' },
              xaxis: { categories: userSignups.map(data => data.month),
                title: {
                    text: 'Months'
                }
             }
            }}
            series={[{ name: 'User Signups', data: userSignups.map(data => data.count) }]}
            type="bar"
          />
<Chart
  options={{
    chart: { id: 'blog-posts' },
    xaxis: {
      categories: blogPosts.map(data => data.date), 
      title: {
        text: 'Dates', 
      },
      labels: {
        rotate: -45, 
        formatter: function (val) {
          return val; 
        },
      },
    },
    title: {
      text: 'Blogs Published Over Time', 
      align: 'center',
    },
  }}
  series={[
    {
      name: 'Blogs Published',
      data: blogPosts.map(data => data.count), // Pass the count data
    },
  ]}
  type="line"
/>

          </div>
    )
}

export default Admin;