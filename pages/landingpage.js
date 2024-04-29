import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import p1 from 'public/images/collage.webp';
import { Card, CardContent, Typography, Grid, Button, Avatar } from '@mui/material';
import { findAllLandingPagePosts } from "./api/landingPage";
import { getUserFromSession } from "@/pages/api/user";

export async function getServerSideProps(ctx) {
    const user = await getUserFromSession(ctx);
    return {
        props: {
            user: user,
            landingPageEntries: await findAllLandingPagePosts()
        }
    };
}

function Post({ title, content, date }) {
    return (
        <Card style={{ marginBottom: '20px', backgroundColor: '#C8E6C9' }}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2">Date: {date}</Typography>
                <Typography variant="body1">{content}</Typography>
            </CardContent>
        </Card>
    );
}

function LandingPage(props) {
    const overlapRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (overlapRef.current) {
                const isLandscape = window.matchMedia("(orientation: landscape)").matches;
                overlapRef.current.style.top = isLandscape ? '10%' : '20%';
            }
        };

        handleResize(); // Initial call to set the initial value

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div style={{ position: 'relative' }}>
            <div
                className="img-grid"
                style={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <Image
                    src={p1}
                    layout="fill"
                    objectFit="cover"
                    alt=""
                />
                <Typography
                    ref={overlapRef}
                    variant="h1"
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'black',
                        textAlign: 'center',
                        zIndex: 1,
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 'clamp(0.8rem, 3vw, 1.5rem)',
                        maxWidth: '80%',
                    }}
                >
                    <a href="https://visionaid.org/" style={{ textDecoration: 'underline', color: 'inherit' }}>Vision-Aid</a> enables, educates, and empowers the visually impaired. Vision-Aid, leveraging its network
                    of resource centers across India and a robust suite of online programs, offers a comprehensive range
                    of devices, training, and services. These initiatives aim to provide holistic vision enhancement and
                    rehabilitation programs for adults and children who are blind or have low vision. Vision Aid Partners include the many
                    partners we work with including pre-eminent organizations in both India and the United States to realize Vision Aid&apos;s mission.
                </Typography>

            </div>
            <div id="stakeholders-section">
                <br></br>
                <Typography variant="h4" style={{ marginBottom: '20px' }}>Vision-Aid Stakeholders</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Avatar
                            alt="Stakeholder 1"
                            src="/images/stakeholder1.jpg"
                            sx={{ width: 100, height: 100, margin: '0 auto' }}
                        />
                        <Typography variant="h6" align="center" gutterBottom>
                            Ms. Devi Udayakumar
                        </Typography>
                        <Typography variant="body1" align="center">
                            Designation: Head, Low Vision Rehabilitation Programs
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Avatar
                            alt="Stakeholder 2"
                            src="/images/stakeholder2.jpg"
                            sx={{ width: 100, height: 100, margin: '0 auto' }}
                        />
                        <Typography variant="h6" align="center" gutterBottom>
                            Ms. Janani Sankaran
                        </Typography>
                        <Typography variant="body1" align="center">
                            Designation: Program Manager, Low Vision Rehabilitation Programs
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <div id="posts-section">
                <br></br>
                <Grid container spacing={2}>
                    {(props.landingPageEntries || []).map((post, index) => (
                        <Grid item xs={12} key={index}>
                            <Post
                                title={post.title}
                                content={post.content}
                                date={new Date(post.creationDate).toLocaleTimeString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div id="stories-section">
                <br></br>
                <Typography variant="h4" style={{ marginBottom: '20px' }}>More Stories</Typography>
                <Typography variant="h6" style={{ marginBottom: '20px' }}>
                    <a href="https://visionaid.org/news/report-on-visit-to-vision-aid-resource-center-pune-on-march-2nd-2024/" style={{ textDecoration: 'underline', color: 'inherit' }}>Report on Visit to Vision-Aid Resource Center, Pune on March 2nd, 2024</a>
                </Typography>
                <Typography variant="h6" style={{ marginBottom: '20px' }}>
                    <a href="https://visionaid.org/news/empowering-youth-highlights-of-summer-camp-2024/" style={{ textDecoration: 'underline', color: 'inherit' }}>Empowering Youth: Highlights of Summer Camp 2024</a>
                </Typography>
            </div>
        </div>
    );
}

export default LandingPage;
