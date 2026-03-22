import React from "https://esm.sh/react@18";
import { createRoot } from "https://esm.sh/react-dom@18/client";
import htm from "https://esm.sh/htm@3.1.1";
import { HashRouter, Routes, Route, NavLink } from "https://esm.sh/react-router-dom@6.30.1";
import { Formik, Form, Field, ErrorMessage } from "https://esm.sh/formik@2.4.6";
import * as Yup from "https://esm.sh/yup@1.4.0";

const html = htm.bind(React.createElement);

const validationSchema = Yup.object({
  name: Yup.string().min(3, "Informe pelo menos 3 caracteres.").required("Nome é obrigatório."),
  email: Yup.string().email("E-mail inválido.").required("E-mail é obrigatório."),
  age: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .min(10, "Idade mínima: 10.")
    .max(99, "Idade máxima: 99."),
  stack: Yup.string().required("Selecione sua stack principal."),
  level: Yup.string().required("Selecione seu nível de senioridade."),
  skills: Yup.array().min(1, "Selecione ao menos 1 interesse."),
  comments: Yup.string().max(400, "Máximo de 400 caracteres.")
});

function Layout({ children }) {
  return html`
    <div className="container">
      <header className="site-header">
        <h1>Pesquisa de Experiencia Dev</h1>
        <p>Versao React com Formik + Yup</p>
        <nav className="nav">
          <${NavLink} to="/" end className=${({ isActive }) => (isActive ? "active" : "")}>Inicio<//>
          <${NavLink} to="/formulario" className=${({ isActive }) => (isActive ? "active" : "")}>Formulario<//>
          <${NavLink} to="/sobre" className=${({ isActive }) => (isActive ? "active" : "")}>Sobre<//>
        </nav>
      </header>
      <main>${children}</main>
    </div>
  `;
}

function HomePage() {
  return html`
    <${Layout}>
      <section className="card">
        <h2>Bem-vindo(a)!</h2>
        <p>
          Este projeto recria o formulario de pesquisa usando React basico, Formik e Yup.
          Navegue para a pagina <strong>Formulario</strong> para responder a pesquisa.
        </p>
      </section>
    <//>
  `;
}

function AboutPage() {
  return html`
    <${Layout}>
      <section className="card">
        <h2>Sobre o projeto</h2>
        <p>
          Aplicacao desenvolvida com componentes React, validacao declarativa com Yup
          e gerenciamento de formulario com Formik.
        </p>
      </section>
    <//>
  `;
}

function SurveyFormFields({ isSubmitting, values }) {
  return html`
    <${Form} id="survey-form">
      <div className="form-group">
        <label htmlFor="name">Nome completo:</label>
        <${Field} id="name" name="name" type="text" placeholder="Digite seu nome" />
        <${ErrorMessage} name="name" component="span" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="email">E-mail:</label>
        <${Field} id="email" name="email" type="email" placeholder="Digite seu melhor e-mail" />
        <${ErrorMessage} name="email" component="span" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="age">Idade (opcional):</label>
        <${Field} id="age" name="age" type="number" min="10" max="99" placeholder="Ex: 25" />
        <${ErrorMessage} name="age" component="span" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="stack">Qual sua stack principal?</label>
        <${Field} as="select" id="stack" name="stack">
          <option value="">Selecione uma opcao</option>
          <option value="frontend">Front-end</option>
          <option value="backend">Back-end</option>
          <option value="fullstack">Fullstack</option>
          <option value="outro">Outro</option>
        <//>
        <${ErrorMessage} name="stack" component="span" className="error" />
      </div>

      <div className="form-group">
        <p>Qual seu nivel de senioridade?</p>
        <label className="inline-option">
          <${Field} type="radio" name="level" value="junior" />
          Junior
        </label>
        <label className="inline-option">
          <${Field} type="radio" name="level" value="pleno" />
          Pleno
        </label>
        <label className="inline-option">
          <${Field} type="radio" name="level" value="senior" />
          Senior
        </label>
        <${ErrorMessage} name="level" component="span" className="error" />
      </div>

      <div className="form-group">
        <p>O que voce deseja aprender em 2024? (Selecione varias)</p>
        <label className="inline-option">
          <${Field} type="checkbox" name="skills" value="react" />
          React / Next.js
        </label>
        <label className="inline-option">
          <${Field} type="checkbox" name="skills" value="node" />
          Node.js / Express
        </label>
        <label className="inline-option">
          <${Field} type="checkbox" name="skills" value="python" />
          Python / IA
        </label>
        <label className="inline-option">
          <${Field} type="checkbox" name="skills" value="typescript" />
          TypeScript
        </label>
        <${ErrorMessage} name="skills" component="span" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="comments">Algum comentario ou sugestao?</label>
        <${Field}
          as="textarea"
          id="comments"
          name="comments"
          placeholder="Escreva aqui seu comentario..."
        />
        <small>${values.comments.length}/400</small>
        <${ErrorMessage} name="comments" component="span" className="error" />
      </div>

      <button type="submit" id="submit" disabled=${isSubmitting}>
        ${isSubmitting ? "Enviando..." : "Enviar Respostas"}
      </button>
    <//>
  `;
}

function SurveyPage() {
  const initialValues = {
    name: "",
    email: "",
    age: "",
    stack: "",
    level: "junior",
    skills: [],
    comments: ""
  };

  return html`
    <${Layout}>
      <section className="card">
        <h2>Formulario de Pesquisa</h2>
        <${Formik}
          initialValues=${initialValues}
          validationSchema=${validationSchema}
          onSubmit=${(values, actions) => {
            alert(`Respostas enviadas com sucesso!\n\n${JSON.stringify(values, null, 2)}`);
            actions.resetForm();
            actions.setSubmitting(false);
          }}
        >
          ${({ isSubmitting, values }) =>
            html`<${SurveyFormFields} isSubmitting=${isSubmitting} values=${values} />`}
        <//>
      </section>
    <//>
  `;
}

function NotFoundPage() {
  return html`
    <${Layout}>
      <section className="card">
        <h2>404 - Rota invalida</h2>
        <p>A pagina que voce tentou acessar nao existe.</p>
      </section>
    <//>
  `;
}

function App() {
  return html`
    <${HashRouter}>
      <${Routes}>
        <${Route} path="/" element=${html`<${HomePage} />`} />
        <${Route} path="/formulario" element=${html`<${SurveyPage} />`} />
        <${Route} path="/sobre" element=${html`<${AboutPage} />`} />
        <${Route} path="*" element=${html`<${NotFoundPage} />`} />
      <//>
    <//>
  `;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
