import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";

export const signups = async(req, res) =>{
    const data = await User.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { "_id": 1 },
        },
    ]);

    res.json(data.map(item => ({month: item._id, count: item.count })));
}

export const getblogs = async(req, res) =>{
    try{
    const blogs = await Blog.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                },
                count: { $sum : 1},
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "_id.day": 1,
              },
        },
        {
            $project: {
                _id: 0,
                date: {
                  $concat: [
                    { $toString: "$_id.year" },
                    "-",
                    { $toString: "$_id.month" },
                    "-",
                    { $toString: "$_id.day" },
                  ],
                },
                count: 1,
              },
        },
    ]);
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching blogs by day", error });
  }
};

export const blogsbyuser = async(req, res) =>{
    try {
        const blogsByUser = await Blog.aggregate([
            {
                $group: {
                    _id: "$author",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "authorDetails"
                }
            },
            {
                $unwind: "$authorDetails",
            },
            {
                $project: {
                    count: 1,
                    authorId: "$_id",
                    authorDetails: { username: 1 },
                }
            }
        ]);
        res.json(blogsByUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const published = async(req, res) =>{
    try{
        const usersWithBlogs = await Blog.distinct('author');
        const publishedCount = usersWithBlogs.length;

        const totalUsers = await User.countDocuments();

        const unpublishedCount = totalUsers - publishedCount;

        res.json([
            { category: 'Published', count: publishedCount },
            { category: 'Unpublished', count: unpublishedCount }
        ]);

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error fetching publication status data' });

    }
}
