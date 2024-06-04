import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { doc, getDoc,  deleteDoc} from "firebase/firestore";
import {db, auth} from "../firebase"
import {useAuthState} from "react-firebase-hooks/auth"
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";



export default function PostPageDetails() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const params = useParams();
  const id = params.id;
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()


  async function deletePost(id) {
    await deleteDoc(doc(db, "posts", id))
    navigate("/")
  }

  async function getPost(id) {
    const query = await getDoc(doc(db, "posts", id), )
    const post = query.data()
    setCaption(post.caption);
    setImage(post.image);
  }

  useEffect(() => {
    if (loading) return
    if (!user) return navigate("/login")
    getPost(id);
  }, [id, loading, navigate, user]);

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            <Nav.Link onClick = {() => signOut(auth)}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%" }} />
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>{caption}</Card.Text>
                <Card.Link href={`/update/${id}`}>Edit</Card.Link>
                <Card.Link
                  onClick={() => deletePost(id)}
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
