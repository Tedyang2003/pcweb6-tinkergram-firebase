
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./views/LoginPage"
import PostPageHome from "./views/PostPageHome"
import SignUpPage from "./views/SignUpPage"
import PostPageAdd from "./views/PostPageAdd"
import PostPageUpdate from "./views/PostPageUpdate"
import PostPageDetails from "./views/PostPageDetails"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostPageHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/add" element={<PostPageAdd />} />
        <Route path="/update/:id" element={<PostPageUpdate />} />
        <Route path="/post/:id" element={<PostPageDetails />} />
      </Routes>
    </ BrowserRouter>
  );
}

export default App;
