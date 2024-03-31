import React from 'react';
import Image from 'next/image';
import p1 from 'public/images/p1.webp';
import p2 from 'public/images/p2.webp';
import p3 from 'public/images/p3.webp';

function Post({ title, content, date }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h4>{title}</h4>
            <p>{content}</p>
            <p>Date: {date}</p>
        </div>
    );
}

function LandingPage(props) {
    return (
        <div>
            <h3>Posts</h3>
            <div className="scroller">
                {[...Array(2)].map((_, index) => (
                    <Post
                        key={index}
                        title={`Post Title ${index + 1}`}
                        content={`Post Content ${index + 1}`}
                        date="March 23, 2024"
                    />
                ))}
                <h3>Vision-Aid and OMSCS collaboration</h3>
                <div style={{ marginBottom: '20px' }}>
                    <Image
                        src={p1}
                        width={200}
                        height={100}
                        alt=""
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Image
                        src={p2}
                        width={300}
                        height={200}
                        alt=""
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Image
                        src={p3}
                        width={200}
                        height={200}
                        alt=""
                    />
                </div>
                <p>More stories of success..</p>
                <p>Thanks!</p>
            </div>
        </div>
    );
}

export default LandingPage;
