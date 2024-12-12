import Chart from "../components/Chart";
import { useState, useEffect } from "react";
import axios from 'axios';

const Admin = () =>{
    const [userSignups, setUserSignups] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [userBlogs, setUserBlogs] = useState([]);
    const [userPublished, setUserPublished] = useState([]);

    useEffect(()=>{
        const fetchData = async()=>{
            const userData = await axios.get('http://localhost:4001/api/analysis/signups');
            const blogData = await axios.get('http://localhost:4001/api/analysis/getblogs');
            const blogsuser = await axios.get('http://localhost:4001/api/analysis/blogsbyuser');
            const userpublished = await axios.get('http://localhost:4001/api/analysis/published');

            setUserSignups(userData.data);
            setBlogPosts(blogData.data);
            setUserBlogs(blogsuser.data);
            setUserPublished(userpublished.data);

        };
        fetchData();
    }, []);


    return (
        <div>
            <div className="text-center mt-4 mb-4 font-semibold text-blue-800" >User Analytics</div>
          <Chart
            options={{
              chart: { id: 'user-signups' },
              xaxis: { categories: userSignups.map(data => data.month),
                title: {
                    text: 'Months',
                },
             },
             title: {
             text: 'Users registered per month',
             align: 'center',
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
    },
    title: {
      text: 'Blogs Published Over Time', 
      align: 'center',
    },
  }}
  series={[
    {
      name: 'Blogs Published',
      data: blogPosts.map(data => data.count), 
    },
  ]}
  type="line"
/>
<Chart
  options={{
    chart: { id: 'blogs-by-user' },
    xaxis: {
      categories: userBlogs.map((data) => (data.authorDetails ? data.authorDetails.username : 'Unknown User'))
      ,
      title: {
        text: 'Users',
      },
    },
    title: {
      text: 'Blogs Published by Users',
      align: 'center',
    },
  }}
  series={[
    {
      name: 'Blogs Published',
      data: userBlogs.map((data) => data.count),
    },
  ]}
  type="bar"
/>
<Chart
    options={{
        chart: { id: 'user-publication-status' },
        labels: userPublished.map((data) => data.category),
        title: {
            text: 'User Publication Status',
            align: 'center',
        },
        legend: {
            position: 'bottom',
        },
    }}
    series={userPublished.map((data) => data.count)} 
    type="pie"
/>
          </div>
    )
}

export default Admin;