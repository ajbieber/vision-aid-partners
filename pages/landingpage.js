import React from 'react';
import Image from 'next/image';
import p2 from 'public/images/vision-aid-logo.webp';
import p1 from 'public/images/collage.webp';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

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
    const scrollToSideBySide = () => {
        const sideBySideSection = document.getElementById('side-by-side-section');
        if (sideBySideSection) {
            sideBySideSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                <Image
                    src={p2}
                    width={200}
                    height={200}
                    style={{
                        position: 'absolute',
                        top: '18%',
                        left: '20%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%',
                        border: '2px solid white',
                    }}
                    alt=""
                />
                <Typography
                    variant="h1"
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '60%',
                        transform: 'translate(-50%, -50%)',
                        color: 'black',
                        textAlign: 'center',
                        zIndex: 1,
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '50px',
                    }}
                >
                Welcome to Vision Aid Partners
            </Typography>
            <Typography
                    variant="h1"
                    style={{
                        position: 'absolute',
                        top: '20%',
                        left: '60%',
                        transform: 'translate(-50%, -50%)',
                        color: 'black',
                        textAlign: 'center',
                        zIndex: 1,
                        fontFamily: 'Arial, sans-serif', 
                        fontSize: '30px', 
                    }}
                >
                Welcome to Vision Aid Partners
            </Typography>
                <Button
    variant="contained"
    onClick={scrollToSideBySide}
    style={{
        zIndex: 1,
        left: '55%',
        position: 'absolute',
        bottom: '70%',
        backgroundColor:'#205c24',
        color: 'white',
        borderRadius: 20,
        padding: '10px 20px',
    }}
>
                    Go to posts
                </Button>
            </div>
            <div id="side-by-side-section">
                <br></br>
                <Grid container spacing={2}>
                    {[...Array(2)].map((_, index) => (
                        <Grid item xs={6} key={index}>
                            <Post
                                title={`Post Title ${index + 1}`}
                                content={`Post Content ${index + 1}`}
                                date="March 23, 2024"
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
            <Grid container spacing={2}>
                {[...Array(2)].map((_, index) => (
                    <Grid item xs={12} key={index}>
                        <Post
                            title={`Post Title ${index + 1}`}
                            content={`Post Content ${index + 1}`}
                            date="March 23, 2024"
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default LandingPage;
