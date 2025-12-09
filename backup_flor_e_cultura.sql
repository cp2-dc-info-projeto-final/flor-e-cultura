--
-- PostgreSQL database dump
--

\restrict 5xBGneRewpSexcSGqVvsiaQ1P7qRV2NGBk2dHPH4K8PlBn0tskKn5otOLFkYYjG

-- Dumped from database version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: itens_pedido; Type: TABLE; Schema: public; Owner: floriculturatcc2025
--

CREATE TABLE public.itens_pedido (
    id bigint NOT NULL,
    pedido_id bigint NOT NULL,
    produto_id bigint NOT NULL,
    quantidade integer NOT NULL,
    preco_unitario numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    criado_em timestamp without time zone DEFAULT now()
);


ALTER TABLE public.itens_pedido OWNER TO floriculturatcc2025;

--
-- Name: itens_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: floriculturatcc2025
--

ALTER TABLE public.itens_pedido ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.itens_pedido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pedidos; Type: TABLE; Schema: public; Owner: floriculturatcc2025
--

CREATE TABLE public.pedidos (
    id bigint NOT NULL,
    usuario_id bigint NOT NULL,
    total numeric(10,2) NOT NULL,
    status text DEFAULT 'PENDENTE'::text NOT NULL,
    data_pedido timestamp without time zone DEFAULT now(),
    criado_em timestamp without time zone DEFAULT now(),
    atualizado_em timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pedidos OWNER TO floriculturatcc2025;

--
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: floriculturatcc2025
--

ALTER TABLE public.pedidos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pedidos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: produtos; Type: TABLE; Schema: public; Owner: karol
--

CREATE TABLE public.produtos (
    id bigint NOT NULL,
    nome_produto text NOT NULL,
    descricao text NOT NULL,
    preco numeric(10,2) NOT NULL,
    quantidade integer DEFAULT 0 NOT NULL,
    criado_em timestamp without time zone DEFAULT now(),
    atualizado_em timestamp without time zone DEFAULT now(),
    imagem text,
    categoria_id integer,
    categoria text
);


ALTER TABLE public.produtos OWNER TO karol;

--
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: karol
--

ALTER TABLE public.produtos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.produtos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: karol
--

CREATE TABLE public.usuarios (
    id bigint NOT NULL,
    nome_completo text NOT NULL,
    email text NOT NULL,
    senha text NOT NULL,
    cpf character varying(14) NOT NULL,
    telefone character varying(15) NOT NULL,
    data_nascimento date NOT NULL,
    tipo_usuario text DEFAULT 'cliente'::text NOT NULL
);


ALTER TABLE public.usuarios OWNER TO karol;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: karol
--

ALTER TABLE public.usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: itens_pedido; Type: TABLE DATA; Schema: public; Owner: floriculturatcc2025
--

COPY public.itens_pedido (id, pedido_id, produto_id, quantidade, preco_unitario, subtotal, criado_em) FROM stdin;
43	23	51	1	40.00	40.00	2025-11-21 16:53:54.492016
44	23	52	1	40.00	40.00	2025-11-21 16:53:54.492016
45	24	3	1	500.00	500.00	2025-11-27 16:54:44.234775
55	33	3	1	500.00	500.00	2025-12-04 17:30:51.132985
56	34	3	1	500.00	500.00	2025-12-05 10:47:51.601499
57	35	3	1	500.00	500.00	2025-12-05 10:55:25.971359
58	36	3	1	500.00	500.00	2025-12-05 10:57:55.659437
59	37	6	1	40.00	40.00	2025-12-06 12:57:51.938305
60	38	57	1	395.90	395.90	2025-12-06 14:06:02.283532
61	38	58	1	390.00	390.00	2025-12-06 14:06:02.283532
\.


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: floriculturatcc2025
--

COPY public.pedidos (id, usuario_id, total, status, data_pedido, criado_em, atualizado_em) FROM stdin;
23	1	80.00	PREPARANDO	2025-11-21 16:53:54.492016	2025-11-21 16:53:54.492016	2025-11-28 17:15:29.436327
24	1	500.00	ENTREGUE	2025-11-27 16:54:44.234775	2025-11-27 16:54:44.234775	2025-11-28 17:15:31.806054
33	49	500.00	CONFIRMADO	2025-12-04 17:30:51.132985	2025-12-04 17:30:51.132985	2025-12-04 17:30:51.132985
34	1	500.00	CONFIRMADO	2025-12-05 10:47:51.601499	2025-12-05 10:47:51.601499	2025-12-05 10:47:51.601499
35	1	500.00	CONFIRMADO	2025-12-05 10:55:25.971359	2025-12-05 10:55:25.971359	2025-12-05 10:55:25.971359
36	1	500.00	CONFIRMADO	2025-12-05 10:57:55.659437	2025-12-05 10:57:55.659437	2025-12-05 10:57:55.659437
37	1	40.00	CONFIRMADO	2025-12-06 12:57:51.938305	2025-12-06 12:57:51.938305	2025-12-06 12:57:51.938305
38	49	785.90	CONFIRMADO	2025-12-06 14:06:02.283532	2025-12-06 14:06:02.283532	2025-12-06 14:06:02.283532
\.


--
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: karol
--

COPY public.produtos (id, nome_produto, descricao, preco, quantidade, criado_em, atualizado_em, imagem, categoria_id, categoria) FROM stdin;
59	buque dente de leão	Um buquê leve e delicado de dentes-de-leão, trazendo suavidade, leveza e o simbolismo de esperança em cada sopro.	450.00	150	2025-12-05 00:00:00	2025-12-05 00:00:00	/uploads/produto-1764966818436-328239029.jpeg	\N	buque
56	Buquê de lírios laranja	Um buquê marcante de lírios laranjas, com flores vibrantes que transmitem energia, alegria e sofisticação em cada detalhe.	395.90	90	2025-12-05 00:00:00	2025-12-05 00:00:00	/uploads/produto-1764967247011-144327040.jpeg	\N	buque
55	Preente Snoopy	Um presente encantador com uma pelúcia do Snoopy acompanhada de flores delicadas, unindo fofura e carinho em um único arranjo.	395.90	11	2222-02-12 00:00:00	2222-02-12 00:00:00	/uploads/produto-1764967332304-361800432.jpeg	\N	presente
54	Buquê flores em chamas	Flores vibrantes em tons de vermelho e laranja, combinando intensidade e calor para criar um arranjo cheio de energia e beleza.	400.00	41	2025-11-27 00:00:00	2025-11-28 00:00:00	/uploads/produto-1764967810076-15837847.jpeg	\N	buque
53	Pelúcia da hello kitty	Uma pelúcia Hello Kitty Baby super fofa e macia, com detalhes delicados que trazem doçura e charme para qualquer presente.	40.00	58	2025-11-17 00:00:00	2025-11-21 00:00:00	/uploads/produto-1764967904556-435163286.jpeg	\N	pelucia
52	Pelúcia de pintinho	Uma pelúcia de pintinho amarelo fofa e mac macia, com charme delicado e perfeito para presentear com carinho.	40.00	40	2025-11-17 00:00:00	2025-11-21 00:00:00	/uploads/produto-1764967974098-920179308.jpeg	\N	pelucia
51	Pelúcia de raposa	Uma pelúcia de raposa fofa e macia, perfeita para abraços cheios de charme e diversão.	40.00	18	2025-11-17 00:00:00	2025-11-21 00:00:00	/uploads/produto-1764968037136-582227954.jpeg	\N	pelucia
7	Vasos de madeira clara	Conjunto de três vasos feitos com madeira clara	40.00	43	2025-10-16 00:00:00	2025-12-01 00:00:00	/uploads/produto-1764968664042-226987508.jpeg	\N	vaso
3	Vaso gnomo 	Conjunto de três vasos pequenos 	50.00	17	2025-10-16 00:00:00	2025-12-05 00:00:00	/uploads/produto-1764968823198-887437086.jpeg	\N	vaso
50	Pelúcia de salamandra	Uma pelúcia divertida e macia de salamandra rosa, perfeita para presentear com fofura e originalidade.	40.00	60	2025-11-08 00:00:00	2025-11-08 00:00:00	/uploads/produto-1764968099866-664705972.jpeg	\N	pelucia
17	Presente coração chique	Uma charmosa caixinha em formato de coração, recheada com docinhos deliciosos e flores delicadas, perfeita para presentear com amor e carinho.	67.00	22	2025-11-08 00:00:00	2025-11-08 00:00:00	/uploads/produto-1764968170761-521424500.jpeg	\N	presente
6	Vaso liso grande	Vaso grande em formato oval feito de madeira	40.00	24	2025-10-16 00:00:00	2025-12-06 12:57:51.938305	/uploads/produto-1764968720434-60082115.jpeg	\N	vaso
16	Presente coquette	Um presente elegante e delicado, combinando charme, sofisticação e um toque de doçura especial.	40.00	22	2025-11-08 00:00:00	2025-11-08 00:00:00	/uploads/produto-1764968234878-70493011.jpeg	\N	presente
15	Presente hello kitty	Um arranjo encantador de flores frescas acompanhado de uma pelúcia da Hello Kitty, perfeito para demonstrar carinho com fofura.	40.00	34	2025-11-08 00:00:00	2025-11-08 00:00:00	/uploads/produto-1764968320466-579355361.jpeg	\N	presente
14	Presente ponyo	Um presente encantador inspirado na animação Ponyo, cheio de cores, fofura e magia, perfeito para fãs do filme.	40.00	23	2025-11-08 00:00:00	2025-11-08 00:00:00	/uploads/produto-1764968384923-368933301.jpeg	\N	presente
11	Semente de girassol	saquinho com sementes de girassol	500.00	7	2025-11-14 00:00:00	2025-11-14 00:00:00	/uploads/produto-1764968452781-165016040.jpeg	\N	semente
10	Semente de lavanda	Saquinho com sementes de lavanda	395.90	34	2025-10-23 00:00:00	2025-11-14 00:00:00	/uploads/produto-1764968504533-758304204.jpeg	\N	semente
9	Semente de margarida	Saquinho com sementes de margarida	40.00	6	2027-09-19 00:00:00	2025-12-04 00:00:00	/uploads/produto-1764968554429-473390051.jpeg	\N	semente
8	Semente de rosas	Saquinho com sementes de rosas	41.00	5	2025-10-16 00:00:00	2025-11-14 00:00:00	/uploads/produto-1764968599832-484366864.jpeg	\N	semente
57	Buquê sonho	Um buquê vibrante de lírios em tons variados, cheio de elegância e alegria, perfeito para iluminar qualquer momento.	395.90	999	2025-12-06 00:00:00	2025-12-06 14:06:02.283532	/uploads/produto-1764967165214-526973961.jpeg	\N	buque
58	Presente toca de coelho	Arranjo delicado de flores frescas acompanhado de uma charmosa pelúcia de coelho, criando um presente doce, acolhedor e cheio de carinho.	390.00	199	2025-12-27 00:00:00	2025-12-06 14:06:02.283532	/uploads/produto-1764966623769-160871708.jpeg	\N	presente
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: karol
--

COPY public.usuarios (id, nome_completo, email, senha, cpf, telefone, data_nascimento, tipo_usuario) FROM stdin;
1	hermenegildo	hermenegildo@email.com	$2a$12$f2c.uHGHS4drfaz6HR870OLamkarD57kI.gkr4//Vbbp0vN9IrFfG	000	213	2002-02-03	admin
6	moisaica	moimoi123@gmail.com	$2b$12$EJDbF/BWSSuzrmngN0k8YOz.Lu8T2jqtDoghYwXkWQ/0CrwDhfOHG	edsfvxvdf	hdhhhd	0344-03-12	1
10	Plagg8	hermenegildo@email.comppp	$2b$12$dYZyFXVrjfmYDb98cL0mbuABGbIwVXuVr2AmXlQYp4VkgmJGEX5MG	6677	199999	2025-10-02	1
12	Plagg999	moimoi123@gmail.comreeeee	$2b$12$3iL4mjCZv3AHFBhvILCFPuvDnODwtl3M.ytwX5hDyCGZUB69K2LTS	422221111	5554411	2025-10-25	1
49	leslie	lele005@gmail.com	$2b$12$eMaOfVgYcWRrMrv.Uqj8aeX7H.2IpPe6D.RflLTCXZtr54nCypDDS	9786097	21974381692	2005-09-11	1
\.


--
-- Name: itens_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: floriculturatcc2025
--

SELECT pg_catalog.setval('public.itens_pedido_id_seq', 61, true);


--
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: floriculturatcc2025
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 38, true);


--
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: karol
--

SELECT pg_catalog.setval('public.produtos_id_seq', 59, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: karol
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 49, true);


--
-- Name: itens_pedido itens_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: floriculturatcc2025
--

ALTER TABLE ONLY public.itens_pedido
    ADD CONSTRAINT itens_pedido_pkey PRIMARY KEY (id);


--
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: floriculturatcc2025
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: karol
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_cpf_key; Type: CONSTRAINT; Schema: public; Owner: karol
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cpf_key UNIQUE (cpf);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: karol
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: karol
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: itens_pedido fk_item_pedido; Type: FK CONSTRAINT; Schema: public; Owner: floriculturatcc2025
--

ALTER TABLE ONLY public.itens_pedido
    ADD CONSTRAINT fk_item_pedido FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE;


--
-- Name: itens_pedido fk_item_produto; Type: FK CONSTRAINT; Schema: public; Owner: floriculturatcc2025
--

ALTER TABLE ONLY public.itens_pedido
    ADD CONSTRAINT fk_item_produto FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE;


--
-- Name: pedidos fk_pedido_usuario; Type: FK CONSTRAINT; Schema: public; Owner: floriculturatcc2025
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO flor_e_cultura;
GRANT ALL ON SCHEMA public TO floriculturatcc2025;


--
-- Name: TABLE itens_pedido; Type: ACL; Schema: public; Owner: floriculturatcc2025
--

GRANT ALL ON TABLE public.itens_pedido TO flor_e_cultura;


--
-- Name: TABLE pedidos; Type: ACL; Schema: public; Owner: floriculturatcc2025
--

GRANT ALL ON TABLE public.pedidos TO flor_e_cultura;


--
-- Name: TABLE produtos; Type: ACL; Schema: public; Owner: karol
--

GRANT ALL ON TABLE public.produtos TO floriculturatcc2025;


--
-- Name: SEQUENCE produtos_id_seq; Type: ACL; Schema: public; Owner: karol
--

GRANT ALL ON SEQUENCE public.produtos_id_seq TO floriculturatcc2025;


--
-- Name: TABLE usuarios; Type: ACL; Schema: public; Owner: karol
--

GRANT ALL ON TABLE public.usuarios TO floriculturatcc2025;


--
-- Name: SEQUENCE usuarios_id_seq; Type: ACL; Schema: public; Owner: karol
--

GRANT ALL ON SEQUENCE public.usuarios_id_seq TO floriculturatcc2025;


--
-- PostgreSQL database dump complete
--

\unrestrict 5xBGneRewpSexcSGqVvsiaQ1P7qRV2NGBk2dHPH4K8PlBn0tskKn5otOLFkYYjG

