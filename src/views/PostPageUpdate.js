import React, { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, Image } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase"
import {doc, updateDoc, getDoc} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";


export default function PostPageUpdate() {
  const params = useParams();
  const id = params.id;
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState()
  const [refPath, setRefPath] = useState("")

  async function updatePost() {

    const imageRef = ref(storage, `images/${image.name}`)
    const delRef = ref(storage, refPath)

    try {
      await deleteObject(delRef)
    } catch (error) {
      console.error(error)
    }

    const response = await uploadBytes(imageRef, image)
    const imageURL = await getDownloadURL(response.ref)

    await updateDoc(doc(db, "posts", id), {
      caption: caption,
      image: imageURL
    })

    navigate(`/post/${id}`)
  }

  async function getPost(id) {
    const query = await getDoc(doc(db, "posts", id)) 
    setCaption(query.data().caption);
    setImage(query.data().image);

    setPreviewImage(query.data().image)

    const url = new URL(query.data().image);
    const pathParts = url.pathname.split('/');
    let refPath = pathParts[pathParts.length - 1]
    refPath =decodeURIComponent(refPath)

    setRefPath(refPath)
  }

  useEffect(() => {
    if (loading) return 
    if (!user) return navigate('/login')
    getPost(id);
  }, [id, loading, user, navigate, refPath]);

  return (
    <div>
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
        <h1 style={{ marginBlock: "1rem" }}>Update Post</h1>
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
            <Form.Label>Image </Form.Label>
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
          <Button variant="primary" onClick={(e) => updatePost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}
