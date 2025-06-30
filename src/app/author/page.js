'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllPosts, getEmployeeById } from '../services/Api';
import Link from 'next/link';
import '../Styles/PostDisplay.css';
import CategoryBar from '../components/CategoryBar';

export default function AuthorPosts() {
    const searchParams = useSearchParams();
    const authorId = searchParams.get('id');

    const [posts, setPosts] = useState([]);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        if (authorId) {
            getEmployeeById(authorId).then(setAuthor);
            getAllPosts().then((res) => {
                const filtered = res.newsList?.filter(p =>
                    p.authorName === authorId && p.status === 'Published'
                );
                setPosts(filtered || []);
            });
        }
    }, [authorId]);

    if (!author) return null;

    return (
        <>
            <div className='author-heading'>
                <CategoryBar />
            </div>
            <div className="mainpost-container">
                <div className="mainpost-left">
                    <h2>Articles by {author.name}</h2>
                    {posts.map(post => (
                        <Link href={`/Mainpost?id=${post._id}`} key={post._id}>
                            <div className="post-card">
                                <img src={post.file} alt={post.title} className="thumbnail" />
                                <div className="post-card-content">
                                    <h4>{post.title}</h4>
                                    <p>{new Date(post.createDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
