/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { fetchPostsFromTodos } from './services/fetchDataFromTodos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Todo[]>([]);
  const [posts, setPosts] = useState<Todo[] | null>([]);
  const [error, setError] = useState<string | null>(null);

  // const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [updateAt, setUpdateAt] = useState<Date>(new Date());
  const [selectedPosts, setSelectedPosts] = useState<Todo | null>(null);

  function reload() {
    setUpdateAt(new Date());
    setError(null);
  }

  useEffect(() => {
    setLoadingPosts(true);

    let timerID: ReturnType<typeof setTimeout>;

    fetchPostsFromTodos()
      .then(data => {
        setAllPosts(data);
        setPosts(data);
      })
      .catch(() => setError('Request failed'))
      .finally(() => {
        timerID = setTimeout(() => setLoadingPosts(false), 300);
      });

    return () => clearTimeout(timerID);
  }, [updateAt]);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                todos={allPosts}
                setFilter={todos => setPosts(todos)}
              />
            </div>

            <div className="block">
              {loadingPosts && <Loader />}
              {!loadingPosts && allPosts.length > 0 && (
                <TodoList
                  todos={posts}
                  onSelect={setSelectedPosts}
                  selectedPosts={selectedPosts}
                />
              )}
              {!loadingPosts && !error && allPosts.length === 0 && (
                <p className="title is-5">There are no users</p>
              )}
              {error && (
                <p className="notification is-danger">
                  {error}
                  <button onClick={reload}>Reload</button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {loadingPosts ? (
        <div className="modal is-active" data-cy="modal">
          <div className="modal-background" />
          <Loader />
        </div>
      ) : selectedPosts ? (
        <TodoModal
          todos={selectedPosts}
          onClose={() => setSelectedPosts(null)}
        />
      ) : null}
    </>
  );
};
