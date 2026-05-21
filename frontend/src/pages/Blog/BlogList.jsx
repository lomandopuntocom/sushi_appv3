import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

const API_URL = 'http://localhost:3000/api';

function getPostDescription(post) {
  if (post.descripcion) {
    return post.descripcion;
  }

  return post.contenido
    .replace(/[#>*_`[\]-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
}

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/blog`);

        if (!response.ok) {
          throw new Error('No se pudieron cargar los posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPosts();
  }, []);

  if (loading) return <div className="blog-page">Cargando posts...</div>;
  if (error) return <div className="blog-page blog-page__error">{error}</div>;

  return (
    <main className="blog-page">
      <header className="blog-page__header">
        <h1>Blog Sushi</h1>
        <p>Novedades, recomendaciones y cultura japonesa desde nuestra cocina.</p>
      </header>

      <section className="blog-list">
        {posts.length === 0 ? (
          <p>Aun no hay posts publicados.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="blog-card">
              <div>
                <h2>{post.nombre}</h2>
                <p>{getPostDescription(post)}{getPostDescription(post).length >= 160 ? '...' : ''}</p>
                <span>
                  {post.autor || post.usuario?.nombre || 'Sushi App'} - {new Date(post.fecha).toLocaleDateString()}
                </span>
              </div>
              <Link to={`/blog/${post.id}`}>Leer post</Link>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
