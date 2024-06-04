import React, { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, Image } from "react-bootstrap";
import {addDoc, collection,} from "firebase/firestore"
import {useAuthState} from "react-firebase-hooks/auth"
import {auth, db, storage} from "../firebase"
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PostPageAdd() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState("https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg")


  async function addPost() {

    const imageRef = ref(storage, `images/${image.name}`)
    const response = await uploadBytes(imageRef, image)
    const imageURL = await getDownloadURL(response.ref)

    const post = {
      caption: caption,
      image: imageURL
    }

    try {
      await addDoc(collection(db, "posts"), post);
      navigate("/")
    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

  }, [loading, user, navigate]);

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            <Nav.Link onClick={() => signOut(auth)}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Add Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lovely day"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>
          <Image src={previewImage} style = {{objectFit: "cover", width: "10rem", height: "10rem"}}></Image>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => {
                const imageFile = e.target.files[0]
                setImage(imageFile)
                const previewImage = URL.createObjectURL(imageFile)
                setPreviewImage(previewImage)
              }}
            />
            <Form.Text className="text-muted">
              Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={async (e) => addPost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}
