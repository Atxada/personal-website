import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { slug as ghSlug } from "@node_modules/github-slugger"

const sortByDate = (a, b) => {
    return new Date(b.date) - new Date(a.date)
}

const postsDir = path.join(process.cwd(), "posts");

export const getAllPosts = () => {
    const fileNames = fs.readdirSync(postsDir);
    const postsObj = fileNames.map((fileName) => {
        const filePath = path.join(postsDir, fileName);
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const {data, content} = matter(fileContents);

        const slug = ghSlug(fileName.replace(/\.md$/, "").toLowerCase());
        return {
            slug,
            content,
            ...data,
        };
    });
    return(postsObj.sort(sortByDate))   
};

export const getAllTags = (posts) => {
    const tags = {}
    posts.forEach(post => {
        post.tags?.forEach(tag => {
            tags[tag] = (tags[tag] ?? 0) + 1;   //?? 0 ensures a default value of 0 if tags[tag] is undefined. + 1 increments the count for the current tag.
        })
    })
    return tags;
};

export const  getPostsByTagSlug = (posts, tag) => {
    return posts.filter(post => {
        if(!post.tags) return false
        const slugifiedTags = post.tags.map(tag => ghSlug(tag))
        return slugifiedTags.includes(tag)
    })
}