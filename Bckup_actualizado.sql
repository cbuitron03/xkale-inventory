--
-- PostgreSQL database dump
--


-- Dumped from database version 17.11
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-29 09:25:27 -05

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

--
-- TOC entry 4514 (class 1262 OID 16462)
-- Name: defaultdb; Type: DATABASE; Schema: -; Owner: avnadmin
--





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

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--




--
-- TOC entry 4516 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16539)
-- Name: auth_user; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.auth_user (
    id_auth integer NOT NULL,
    username text NOT NULL,
    email text,
    hashed_password text NOT NULL,
    rol text DEFAULT 'inventario'::text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rol_valido CHECK ((rol = ANY (ARRAY['admin'::text, 'tecnico'::text, 'inventario'::text])))
);



--
-- TOC entry 225 (class 1259 OID 16538)
-- Name: auth_user_id_auth_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.auth_user_id_auth_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 4517 (class 0 OID 0)
-- Dependencies: 225
-- Name: auth_user_id_auth_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.auth_user_id_auth_seq OWNED BY public.auth_user.id_auth;


--
-- TOC entry 222 (class 1259 OID 16491)
-- Name: laptop; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.laptop (
    id_laptop integer NOT NULL,
    usu_id_laptop integer NOT NULL,
    serial text,
    marca text,
    modelo text,
    cpu text,
    gpu text,
    ram text,
    disco text,
    pantalla text,
    no_factura text,
    fecha_compra date,
    hostname text,
    garantia_hasta date
);



--
-- TOC entry 221 (class 1259 OID 16490)
-- Name: laptop_id_laptop_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

ALTER TABLE public.laptop ALTER COLUMN id_laptop ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.laptop_id_laptop_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16483)
-- Name: tecnico; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.tecnico (
    id_tecnico integer NOT NULL,
    tecnico_nombre text,
    tecnico_correo text
);



--
-- TOC entry 219 (class 1259 OID 16482)
-- Name: tecnico_id_tecnico_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

ALTER TABLE public.tecnico ALTER COLUMN id_tecnico ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tecnico_id_tecnico_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 16505)
-- Name: ticket; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.ticket (
    id_ticket integer NOT NULL,
    tec_id integer NOT NULL,
    lap_id integer NOT NULL,
    incidencia text,
    descripcion text,
    estado text,
    fecha_inicio date,
    fecha_cierre date,
    solucion text
);



--
-- TOC entry 223 (class 1259 OID 16504)
-- Name: ticket_id_ticket_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

ALTER TABLE public.ticket ALTER COLUMN id_ticket ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ticket_id_ticket_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 16475)
-- Name: usuario; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre text,
    apellido text,
    correo text
);



--
-- TOC entry 217 (class 1259 OID 16474)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

ALTER TABLE public.usuario ALTER COLUMN id_usuario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuario_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4331 (class 2604 OID 16542)
-- Name: auth_user id_auth; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id_auth SET DEFAULT nextval('public.auth_user_id_auth_seq'::regclass);


--
-- TOC entry 4508 (class 0 OID 16539)
-- Dependencies: 226
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

INSERT INTO public.auth_user VALUES (1, 'admin', 'admin@xkale.com', '$2b$12$crjds4kK5yd3M8IqoVv6Quvvb00QYLjvsJ5dhKPDHCvF/ZSJkjPIO', 'admin', true, '2026-04-14 03:49:52.04776') ON CONFLICT DO NOTHING;
INSERT INTO public.auth_user VALUES (3, 'erojas', 'erojas@xkale.com', '$2b$12$6feWus.5kqQy/GSgCu0MAOF7sAyZW2EDn3TuftQpKzpOQQjyOfS9K', 'inventario', true, '2026-05-03 22:36:25.364825') ON CONFLICT DO NOTHING;
INSERT INTO public.auth_user VALUES (4, 'mbenitez', 'mbenitez@xkale.com', '$2b$12$/U04yrErZEeZwHWgVtweRuYY7aLerdBAa.jCuCTg4HyIQSAdhY3V6', 'tecnico', true, '2026-05-03 22:36:48.674514') ON CONFLICT DO NOTHING;
INSERT INTO public.auth_user VALUES (2, 'cbuitron', 'cbuitron@xkale.com', '$2b$12$feXgc8bMLrto2vK9TX6NueM34VNnJcYrzhKv/z3zsUfJ.lDwtwRQ6', 'tecnico', true, '2026-05-03 22:35:55.521873') ON CONFLICT DO NOTHING;


--
-- TOC entry 4504 (class 0 OID 16491)
-- Dependencies: 222
-- Data for Name: laptop; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (1, 27, 'PF4MC38D', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-ESANDOVALIN', '2025-02-01') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (2, 29, 'MP1GNCGN', 'Lenovo', 'Yoga 730-13IKB (81CT)', 'Intel Core i5-8250U', 'Intel UHD 620', '8GB DDR4', '465GB', '13.3" FHD', NULL, NULL, 'PC-EROJAS', '2020-04-17') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (3, 63, 'PF5BZLAF', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-LSANTILLAN', '2026-02-14') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (4, 84, 'PF5QCRCK', 'Lenovo', 'V15 G4 IRU (83A1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '8GB DDR4', '476GB', '15.6" FHD', NULL, NULL, 'PC-SZAMBRANO', '2026-08-26') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (5, 3, '2JMZXF3', 'Dell', 'Vostro 3400', NULL, NULL, NULL, '465GB', NULL, NULL, NULL, 'PC-SMINAYO-TMP', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (6, 16, 'PF5C72YJ', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-CBAQUERO', '2026-02-14') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (7, 81, 'PF5609NY', 'Lenovo', 'ThinkPad E14 Gen 6 (21M7)', 'Intel Core Ultra 5 125H', 'Intel Arc Graphics', '16GB DDR5', '475GB', '14" WUXGA', NULL, NULL, 'PC-JVALENCIA', '2028-07-29') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (8, 36, 'PF50FZK7', 'Lenovo', 'V14 G4 IRU (83A0)', 'Intel Core i7-1355U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-FVELASTEGUI', '2025-08-28') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (9, 60, 'Y2122517H', 'Dynabook', 'TECRA A40-K', NULL, NULL, NULL, '173GB', NULL, NULL, NULL, 'PC-LAUCATOMA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (10, 39, 'F6PX1W2', 'Dell', 'Vostro 3480', NULL, NULL, NULL, '464GB', NULL, NULL, NULL, 'PC-GNARVAEZ', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (11, 31, '81HZH93', 'Dell', 'Vostro 3401', NULL, NULL, NULL, '222GB', NULL, NULL, NULL, 'PC-EGAVILANES', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (12, 79, 'PF5MYWGV', 'Lenovo', 'IdeaPad Slim 3 15IRH10 (83K1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '16GB DDR5', '476GB', '15.3" WUXGA', NULL, NULL, 'PC-PELAEZ', '2026-10-06') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (14, 40, 'PF4MBEZX', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-GGALABAY', '2025-02-01') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (15, 48, 'N3NXCV236911137', 'Asus', 'ASUS P1412CEA_P1412CEA', NULL, NULL, NULL, '238GB', NULL, NULL, NULL, 'PC-JCHUQUIMARCA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (16, 62, 'BRR64W3', 'Dell', 'Vostro 3400', NULL, NULL, NULL, '238GB', NULL, NULL, NULL, 'PC-CALBUJA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (17, 50, '619VBV2', 'Dell', 'Vostro 3480', NULL, NULL, NULL, '342GB', NULL, NULL, NULL, 'HT-JP', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (18, 87, 'PF4CVP53', 'Lenovo', 'ideapad 3-14ITL6 (82H7)', 'Intel Core i5-1155G7', 'Intel Iris Xe Graphics', '8GB DDR4', '237GB', '14" FHD TN 60Hz', NULL, NULL, 'PC-SSILVA', '2024-06-08') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (19, 23, 'PF5RPFKP', 'Lenovo', 'ThinkPad E16 Gen 3 (21SS)', 'Intel Core Ultra 7 255H', 'Intel Arc 140T GPU', '16GB DDR5', '952GB', '16" WUXGA', NULL, NULL, 'PC-DCALATRAVA', '2029-01-11') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (20, 45, 'MXX4080LYJ', 'HP', '20-b354la', NULL, NULL, NULL, '911GB', NULL, NULL, NULL, 'HP', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (21, 6, '5CD3239FX5', 'HP', 'HP Laptop 14-dq2xxx', 'Intel Core i5-1135G7', 'Intel Iris Xe Graphics', '4GB DDR4', '465GB', '14"', NULL, NULL, 'PC-AROCHA-BOL', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (22, 25, '3CBZXF3', 'Dell', 'Vostro 3400', NULL, NULL, NULL, '465GB', NULL, NULL, NULL, 'PC-DMORA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (24, 83, 'R8N0CX04E276334', 'Asus', 'Vivobook_ASUSLaptop X1504ZA_X1504ZA', NULL, NULL, NULL, '476GB', NULL, NULL, NULL, 'PC-JMINAYO', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (25, 45, 'PF5C5SHN', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-JORELLANAH', '2026-02-14') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (26, 34, 'PF5Q9MB5', 'Lenovo', 'V15 G4 IRU (83A1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '8GB DDR4', '476GB', '15.6" FHD', NULL, NULL, 'PC-EALBAN', '2026-08-26') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (27, 49, 'D33GXS2', 'Dell', 'G7 7588', NULL, NULL, NULL, '117GB', NULL, NULL, NULL, 'DELL-G7-XKALE', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (28, 83, '4S01N93', 'Dell', 'Latitude 5520', NULL, NULL, NULL, '476GB', NULL, NULL, NULL, 'PC-SMINAYO', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (29, 19, 'PF5RPGP2', 'Lenovo', 'ThinkPad E16 Gen 3 (21SS)', 'Intel Core Ultra 7 255H', 'Intel Arc 140T GPU', '16GB DDR5', '952GB', '16" WUXGA', NULL, NULL, 'PC-STUFINO', '2029-01-11') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (30, 21, 'JG81BX3', 'Dell', 'Vostro 3400', NULL, NULL, NULL, '238GB', NULL, NULL, NULL, 'PC-MPEREZ', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (31, 29, 'CND34800WY', 'HP', 'HP 250 15.6 inch G9 Notebook PC', 'Intel Core i5-1235U', NULL, '16GB', '476GB', '15"', NULL, NULL, 'PC-EROJAS', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (32, 63, 'JWJT7T2', 'Dell', 'Vostro 3480', NULL, NULL, NULL, '465GB', NULL, NULL, NULL, 'HT-LS', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (33, 58, 'NXKDJAL00E3380492B2N00', 'Acer', 'Aspire A314-36P', NULL, NULL, NULL, '476GB', NULL, NULL, NULL, 'FAMILYACOSTA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (34, 8, 'L9NXCV061800376', 'Asus', 'ASUS EXPERTBOOK P2451FB_P2451FB', NULL, NULL, NULL, '476GB', NULL, NULL, NULL, 'PC-JSOLIS', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (35, 89, 'PF5QD75M', 'Lenovo', 'V15 G4 IRU (83A1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '8GB DDR4', '476GB', '15.6" FHD', NULL, NULL, 'PC-TDIAZ', '2026-08-26') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (36, 28, '5CD0314WV6', 'HP', 'HP ProBook 440 G7', 'Intel Core i5-10210U', 'Intel UHD Graphics 620', '8GB DDR4', '195GB', '14" HD (1366 x 768)', NULL, NULL, 'DESKTOP-HFG4UUC', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (37, 59, 'CND4410F0J', 'HP', 'HP 250 15.6 inch G9 Notebook PC', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '15.6" HD (1366 x 768)', NULL, NULL, 'PC-LCAGIGAL', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (39, 8, '5CD9020XFK', 'HP', 'HP ProBook 440 G5', 'Intel Core i7-8550U', 'Intel UHD Graphics 620', '8GB DDR4', '234GB', '14" HD (1366 x 768)', NULL, NULL, 'J-SOLIS', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (40, 91, 'PF5CBF1A', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-VCANDADO', '2026-02-14') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (42, 8, '5CD8365NBJ', 'HP', 'HP ProBook 440 G5', 'Intel Core i7-8550U', 'Intel UHD Graphics 620', '8GB DDR4', '234GB', '14" HD (1366 x 768)', NULL, NULL, 'J-SOLIS', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (43, 12, 'L9NXCV05D01937D', 'Asus', 'ASUS EXPERTBOOK P2451FB_P2451FB', NULL, NULL, NULL, '465GB', NULL, NULL, NULL, 'PC-CBUITRON', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (44, 58, 'N3NXCV23691913E', 'Asus', 'ASUS P1412CEA_P1412CEA', NULL, NULL, NULL, '238GB', NULL, NULL, NULL, 'PC-KTOVAR', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (45, 64, 'N3NXCV23690513A', 'Asus', 'ASUS P1412CEA_P1412CEA', NULL, NULL, NULL, '930GB', NULL, NULL, NULL, 'PC-MBENITEZ', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (46, 86, 'PF5BZ3JZ', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '251GB', '14" FHD', NULL, NULL, 'PC-SVINUEZA', '2026-02-14') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (47, 10, 'PF50FRQ7', 'Lenovo', 'V14 G4 IRU (83A0)', 'Intel Core i7-1355U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-AGUIJARRO', '2025-08-28') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (48, 68, 'JGLNMQ2', 'Dell', 'Latitude 7490', NULL, NULL, NULL, '237GB', NULL, NULL, NULL, 'PC-MMORENO', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (49, 92, 'PF5C9MPY', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '377GB', '14" FHD', NULL, NULL, 'PC-VCLAUDIO', '2026-02-14') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (50, 58, 'PF5Q80QD', 'Lenovo', 'V15 G4 IRU (83A1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '8GB DDR4', '476GB', '15.6" FHD', NULL, NULL, 'PC-KTOVAR', '2026-08-26') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (51, 54, 'L9NXCV05D042376', 'Asus', 'ASUS EXPERTBOOK P2451FB_P2451FB', NULL, NULL, NULL, '235GB', NULL, NULL, NULL, 'PC-JREAL', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (52, 78, '5CD8365N9G', 'HP', 'HP ProBook 440 G5', 'Intel Core i7-8550U', 'Intel UHD Graphics 620', '8GB DDR4', '893GB', '14" HD (1366 x 768)', NULL, NULL, 'PC-FVELASTEGUI', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (53, 51, '9RV9RF3', 'Dell', 'Vostro 3400', NULL, NULL, NULL, '465GB', NULL, NULL, NULL, 'PC-JSANCHEZ-GYE', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (54, 39, 'PF50FTZQ', 'Lenovo', 'V14 G4 IRU (83A0)', 'Intel Core i7-1355U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-GNARVAEZ', '2025-08-28') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (55, 84, '5CD3239FXJ', 'HP', 'HP Laptop 14-dq2xxx', 'Intel Core i5-1135G7', 'Intel Iris Xe Graphics', '4GB DDR4', '476GB', '14"', NULL, NULL, 'PC-SZAMBRANO-COL', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (56, 71, 'PF4MBF0C', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-MSALVADOR', '2025-02-01') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (57, 66, '5CD3239FTS', 'HP', 'HP Laptop 14-dq2xxx', NULL, NULL, NULL, '465GB', NULL, NULL, NULL, 'PC-MPAEZ', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (58, 20, 'S7N0CV22778431B', 'Asus', 'Vivobook_ASUSLaptop X1605ZA_X1605ZA', NULL, NULL, NULL, '476GB', NULL, NULL, NULL, 'PC-CCERDA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (61, 82, '8P38BV2', 'Dell', 'Vostro 3480', NULL, NULL, NULL, '465GB', NULL, NULL, NULL, 'PC-RLOPEZ', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (62, 44, 'PF5BZLAT', 'Lenovo', 'V14 G3 IAP (82TS)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '16GB DDR4', '476GB', '14" FHD', NULL, NULL, 'PC-JTERAN', '2026-02-14') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (63, 34, 'JRNV7T2', 'Dell', 'Vostro 3480', NULL, NULL, NULL, '223GB', NULL, NULL, NULL, 'PC-EALBAN', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (64, 70, 'CL9V4P2', 'Dell', 'Vostro 14-3468', NULL, NULL, NULL, '446GB', NULL, NULL, NULL, 'PC-MRUIZ', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (65, 57, '8PZ58F3', 'Dell', 'Vostro 3400', NULL, NULL, NULL, '465GB', NULL, NULL, NULL, 'PC-JLEMA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (66, 95, 'L9NXCV061771379', 'Asus', 'ASUS EXPERTBOOK P2451FB_P2451FB', NULL, NULL, NULL, '475GB', NULL, NULL, NULL, 'PC-WMORENO', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (67, 25, 'PF5Q7VEL', 'Lenovo', 'V15 G4 IRU (83A1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '8GB DDR4', '476GB', '15.6" FHD', NULL, NULL, 'PC-DMORA', '2026-08-26') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (69, 91, '8F9V4P2', 'Dell', 'Vostro 14-3468', NULL, NULL, NULL, '894GB', NULL, NULL, NULL, 'PC-VCANDADO', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (71, 40, '5CD6456D67', 'HP', 'HP ProBook 450 G3', 'Intel Core i7-6500U', 'Intel HD Graphics 520', '4GB DDR4', '894GB', '15"', NULL, NULL, 'HT-GG', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (72, 2, '5CD73417MC', 'HP', 'HP 240 G6 Notebook PC', 'Intel Core i5-7200U', 'Intel HD Graphics 620', '4GB DDR4', '232GB', '14" HD (1366 x 768)', NULL, NULL, 'PC-ABONILLA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (76, 34, 'G72BRF3', 'Dell', 'Vostro 3400', NULL, NULL, NULL, '931GB', NULL, NULL, NULL, 'PC-EALBAN', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (80, 29, 'B9VLXF3', 'Dell', 'Vostro 3400', NULL, NULL, NULL, '465GB', NULL, NULL, NULL, 'PC-EROJAS', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (85, 92, '5CD73417B2', 'HP', 'HP 240 G6 Notebook PC', 'Intel Core i5-7200U', 'Intel HD Graphics 620', '4GB DDR4', '153GB', '14" HD (1366 x 768)', NULL, NULL, 'HT-VC', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (92, 55, '5CD3239FW9', 'HP', 'HP Laptop 14-dq2xxx', 'Intel Core i5-1135G7', 'Intel Iris Xe Graphics', '4GB DDR4', '465GB', '14"', NULL, NULL, 'BACKUP-XKALEMX', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (93, 100, 'PF62DJ3B', 'Lenovo', 'V15 G5 IRL (83GW)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '16GB DDR5', '475GB', '15.6" FHD', NULL, NULL, 'PC-FPADILLA', '2029-02-23') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (94, 82, 'PF663GB6', 'Lenovo', 'IdeaPad Slim 3 15IRH10 (83K1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '16GB DDR5', '476GB', '15.3" WUXGA', NULL, NULL, 'PC-RLOPEZ', '2027-05-17') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (95, 98, 'PF5ZJJVG', 'Lenovo', 'IdeaPad Slim 3 15IRH10 (83K1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '16GB DDR5', '476GB', '15.3" WUXGA', NULL, NULL, 'PC-ACASTRO', '2027-03-19') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (96, 83, '9S716R112248ZI8000077', 'MSI', 'GF63 8RC', NULL, NULL, NULL, '223GB', NULL, NULL, NULL, 'ANDREINA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (97, 101, 'PF5RPD8B', 'Lenovo', 'ThinkPad E16 Gen 3 (21SS)', 'Intel Core Ultra 7 255H', 'Intel Arc 140T GPU', '16GB DDR5', '952GB', '16" WUXGA', NULL, NULL, 'PC-FBAQUERO', '2029-01-11') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (98, 3, 'PF5ZFFAA', 'Lenovo', 'IdeaPad Slim 3 15IRH10 (83K1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '16GB DDR5', '476GB', '15.3" WUXGA', NULL, NULL, 'PC-ACASAMEN', '2027-03-19') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (99, 83, 'H7R5WW3', 'Dell', 'Inspiron 15 3520', NULL, NULL, NULL, '475GB', NULL, NULL, NULL, 'PC-SMINAYO', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (100, 46, 'PF667RQZ', 'Lenovo', 'ThinkPad E16 Gen 3 (22B0)', 'Intel Core Ultra 7 258V', 'Intel Arc Graphics 140V', '32GB LPDDR5X', '470GB', '16" WUXGA', NULL, NULL, 'PC-JREVELO', '2027-05-20') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (101, 2, '84LCD44', 'Dell', 'Inspiron 15 3520', NULL, NULL, NULL, '476GB', NULL, NULL, NULL, 'PC-ABONILLA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (102, 24, 'N3N0CV11U421113', 'Asus', 'VivoBook_ASUSLaptop X415EA_X415EA', NULL, NULL, NULL, '166GB', NULL, NULL, NULL, 'PC-DBRAVO', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (103, 70, 'PF5ZJFW7', 'Lenovo', 'IdeaPad Slim 3 15IRH10 (83K1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '16GB DDR5', '476GB', '15.3" WUXGA', NULL, NULL, 'PC-MRUIZ', '2027-03-19') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (104, 29, 'PF665VE9', 'Lenovo', 'IdeaPad Slim 3 15IRH10 (83K1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '16GB DDR5', '476GB', '15.3" WUXGA', NULL, NULL, 'PC-EROJAS', '2027-05-17') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (105, 102, 'PF62AYXT', 'Lenovo', 'V15 G5 IRL (83GW)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '16GB DDR5', '475GB', '15.6" FHD', NULL, NULL, 'PC-JBORJA', '2029-02-23') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (106, 61, '6L7NVC3', 'Dell', 'Vostro 3400', NULL, NULL, NULL, '232GB', NULL, NULL, NULL, 'PC-LCONSTANTE', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (107, 99, 'PF5Z53F5', 'Lenovo', 'IdeaPad Slim 3 15IRH10 (83K1)', 'Intel Core i7-13620H', 'Intel UHD Graphics', '16GB DDR5', '476GB', '15.3" WUXGA', NULL, NULL, 'PC-CCISNEROS', '2027-03-19') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (108, 69, 'S9NRKD015007392', 'Asus', 'ASUS TUF Gaming F15 FX507VV_FX507VV', NULL, NULL, NULL, '953GB', NULL, NULL, NULL, 'PC-MTITUANA', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (109, 21, 'PF66SJV2', 'Lenovo', 'ThinkPad E16 Gen 3 (22B0)', 'Intel Core Ultra 7 258V', 'Intel Arc Graphics 140V', '32GB LPDDR5X', '953GB', '16" WUXGA', NULL, NULL, 'PC-MPEREZ', '2027-05-20') ON CONFLICT DO NOTHING;
INSERT INTO public.laptop OVERRIDING SYSTEM VALUE VALUES (110, 13, 'PF4NE3BM', 'Lenovo', 'V15 G3 IAP (82TT)', 'Intel Core i7-1255U', 'Intel Iris Xe Graphics', '8GB DDR4', '465GB', '15.6" FHD', NULL, NULL, 'PC-CALBUJA_TMP', '2024-12-23') ON CONFLICT DO NOTHING;


--
-- TOC entry 4502 (class 0 OID 16483)
-- Dependencies: 220
-- Data for Name: tecnico; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

INSERT INTO public.tecnico OVERRIDING SYSTEM VALUE VALUES (1, 'Marco Benítez', 'mbenitez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.tecnico OVERRIDING SYSTEM VALUE VALUES (2, 'Camilo Buitrón', 'cbuitron@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.tecnico OVERRIDING SYSTEM VALUE VALUES (3, 'Luis Santillán', 'lsantillan@xkale.com') ON CONFLICT DO NOTHING;


--
-- TOC entry 4506 (class 0 OID 16505)
-- Dependencies: 224
-- Data for Name: ticket; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

INSERT INTO public.ticket OVERRIDING SYSTEM VALUE VALUES (1, 2, 5, 'Falla en Pin de Carga', 'La conexión del cargador es intermitente.', 'cerrado', '2026-04-06', '2026-04-07', 'Se cambió el pin con uno existente en el stock de xkale.') ON CONFLICT DO NOTHING;


--
-- TOC entry 4500 (class 0 OID 16475)
-- Dependencies: 218
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (1, 'Adrián', 'Molina', 'amolina@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (2, 'Alejandro', 'Bonilla', 'abonilla@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (3, 'Alicia', 'Casamen', 'acasamen@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (4, 'Ana', 'Armijos', 'aarmijos@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (5, 'Andrea', 'Baquero', 'abaquero@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (6, 'Andres', 'Rocha Arana', 'rrocha@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (7, 'Angel Gabriel', 'Medina Alvarez', 'amedina@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (8, 'Angel Joel', 'Solis Andino', 'jsolis@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (9, 'Angela', 'Molina', 'mmolina@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (10, 'Ariel Jianilo', 'Guijarro Molina', 'aguijarro@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (11, 'Bryan Sebastian', 'Velasco Lopez', 'bvelasco@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (12, 'Camilo Andrés', 'Buitrón Arroyo', 'cbuitron@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (13, 'Carlos Efraín', 'Albuja Moreta', 'calbuja@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (14, 'Carlos', 'Soria', 'csoria@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (15, 'Carolina Ailín', 'Andrada Moreno', 'candrada@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (16, 'Carolina', 'Baquero', 'cbaquero@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (17, 'Carolina', 'Tobar', 'ctobar@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (18, 'César', 'Armijos', 'carmijos@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (19, 'César Sebastián', 'Tufiño Oñate', 'stufino@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (20, 'Cristhian', 'Cerda', 'ccerda@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (21, 'Cristopher Mateo', 'Perez Baez', 'cperez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (22, 'Daniel Aaron', 'Velasco Baquero', 'dvelazco@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (23, 'Daniel', 'Calatrava', 'dcalatrava@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (24, 'Diana Paola', 'Bravo Alarcon', 'dbravo@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (25, 'Diego', 'Mora', 'dmora@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (26, 'Diego', 'Salazar', 'dsalazar@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (27, 'Edison', 'Sandovalin', 'esandovalin@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (28, 'Efrén', 'Gómez', 'egomez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (29, 'Eleazar', 'Rojas', 'erojas@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (30, 'Eliana Caterine', 'Alvarado Ruiz', 'ealvarado@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (31, 'Elizabeth', 'Gavilanes', 'egavilanes@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (32, 'Erick', 'Gordillo', 'egordillo@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (33, 'Esteban Fernando', 'Rengel Paredes', 'erengel@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (34, 'Estefanía', 'Albán', 'ealban@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (35, 'Fernando', 'Franco', 'ffranco@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (36, 'Francis Belén', 'Velastegui Armas', 'fvelastegui@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (37, 'Francisco', 'Soria', 'fsoria@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (38, 'Galo', 'Molina', 'galo.molina@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (39, 'Geovanna', 'Narvaez', 'gnarvaez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (40, 'Gladys', 'Galabay', 'ggalabay@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (41, 'Gloria', 'Cuñas', 'gloria@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (42, 'Grace', 'Montenegro', 'gmontenegro@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (43, 'Ivan', 'Molina', 'jmolina@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (44, 'Jaime Leandro', 'Terán Medina', 'jteran@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (45, 'Javier', 'Orellana', 'jorellana@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (46, 'Javier Steven', 'Revelo Quiroz', 'jrevelo@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (47, 'Jeaneth', 'Quilligana', 'jquilligana@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (48, 'Jessenia Alexandra', 'Chuquimarca Sosapanta', 'jchuquimarca@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (49, 'Jorge', 'Tello', 'jtello@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (50, 'José Luis', 'Pacheco Laje', 'jpacheco@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (51, 'Jostin Fernando', 'Sanchez Muñoz', 'jsanchez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (52, 'Josué', 'Garrido', 'jgarrido@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (53, 'Juan', 'Carballo', 'jcarballo@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (54, 'Juan Carlos', 'Real', 'jreal@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (55, 'Juan Diego', 'Astudillo', 'jastudillo@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (56, 'Juan Esteban', 'Villacís', 'jvillacis@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (57, 'Julio', 'Lema', 'jlema@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (58, 'Karen Paola', 'Tovar Sierra', 'ktovar@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (59, 'Luis Alejandro', 'Cagigal Camacho', 'lcagigal@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (60, 'Luis', 'Aucatoma', 'laucatoma@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (61, 'Luis', 'Constante', 'lconstante@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (62, 'Luis Fernando', 'Rodriguez Ramos', 'frodriguez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (63, 'Luis', 'Santillan', 'lsantillan@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (64, 'Marco Alejandro', 'Benitez Cadena', 'mbenitez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (65, 'Marco', 'Guzmán', 'mguzman@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (66, 'Maria Cecilia', 'Páez', 'mcpaez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (67, 'María Isabel', 'Bastidas', 'ibastidas@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (68, 'Mariana', 'Moreno', 'mmoreno@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (69, 'Marily', 'Tituaña', 'mtituana@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (70, 'Mateo Andre', 'Ruiz Dávila', 'mruiz@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (71, 'Mateo Nicolas', 'Salvador Vallejo', 'msalvador@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (72, 'Matías', 'Astudillo', 'mastudillo@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (73, 'Mauricio', 'Lema', 'mlema@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (74, 'Mercedes', 'Flor', 'mflor@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (75, 'Miguel Alejandro', 'Sanchez Aguirre', 'msanchez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (76, 'Minnelly', 'Lucero', 'mlucero@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (77, 'Oscar', 'Sanchez', 'osanchez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (78, 'Pablo Mateo', 'Salgado Espinosa', 'psalgado@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (79, 'Paola', 'Peláez', 'ppelaez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (80, 'Rene Javier', 'Yerovi Arias', 'ryerovi@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (81, 'Roberto Javier', 'Valencia Delgado', 'jvalencia@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (82, 'Roberto', 'López', 'rlopez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (83, 'Samanta', 'Minayo', 'jminayo@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (84, 'Samar Rahab', 'Zambrano Valle', 'szambrano@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (85, 'Samuel Angel', 'Sánchez Quispe', 'ssanchez@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (86, 'Santiago', 'Vinueza', 'svinueza@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (87, 'Silvia Sara', 'Silva Salazar', 'ssilva@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (88, 'Stefanya', 'Arias', 'sarias@hightelecom.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (89, 'Tatiana', 'Díaz', 'tdiaz@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (90, 'Tito', 'Casamen', 'tcasamen@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (91, 'Vanessa', 'Candado', 'vcandado@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (92, 'Víctor', 'Claudio', 'vclaudio@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (93, 'Víctor', 'Delgado', 'vdelgado@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (94, 'Victor', 'Torres', 'vtorres@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (95, 'William', 'Moreno', 'wmoreno@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (98, 'Auramaria', 'Castro Garcia', 'acastro@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (99, 'Carlos Alejandro', 'Cisneros Umatambo', 'ccisneros@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (100, 'Frania Georgina', 'Cuauhtli Padilla', 'fpadilla@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (101, 'Jenner Francois', 'Baquero Morales', 'fbaquero@xkale.com') ON CONFLICT DO NOTHING;
INSERT INTO public.usuario OVERRIDING SYSTEM VALUE VALUES (102, 'Juan Pablo', 'Borja Quintana', 'jborja@xkale.com') ON CONFLICT DO NOTHING;


--
-- TOC entry 4518 (class 0 OID 0)
-- Dependencies: 225
-- Name: auth_user_id_auth_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.auth_user_id_auth_seq', 4, true);


--
-- TOC entry 4519 (class 0 OID 0)
-- Dependencies: 221
-- Name: laptop_id_laptop_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.laptop_id_laptop_seq', 110, true);


--
-- TOC entry 4520 (class 0 OID 0)
-- Dependencies: 219
-- Name: tecnico_id_tecnico_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.tecnico_id_tecnico_seq', 3, true);


--
-- TOC entry 4521 (class 0 OID 0)
-- Dependencies: 223
-- Name: ticket_id_ticket_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.ticket_id_ticket_seq', 3, true);


--
-- TOC entry 4522 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 102, true);


--
-- TOC entry 4348 (class 2606 OID 16550)
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id_auth);


--
-- TOC entry 4350 (class 2606 OID 16552)
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- TOC entry 4342 (class 2606 OID 16497)
-- Name: laptop laptop_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.laptop
    ADD CONSTRAINT laptop_pkey PRIMARY KEY (id_laptop);


--
-- TOC entry 4339 (class 2606 OID 16489)
-- Name: tecnico tecnico_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.tecnico
    ADD CONSTRAINT tecnico_pkey PRIMARY KEY (id_tecnico);


--
-- TOC entry 4346 (class 2606 OID 16511)
-- Name: ticket ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT ticket_pkey PRIMARY KEY (id_ticket);


--
-- TOC entry 4337 (class 2606 OID 16481)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4340 (class 1259 OID 16503)
-- Name: idx_laptop_usuario; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX idx_laptop_usuario ON public.laptop USING btree (usu_id_laptop);


--
-- TOC entry 4343 (class 1259 OID 16523)
-- Name: idx_ticket_laptop; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX idx_ticket_laptop ON public.ticket USING btree (lap_id);


--
-- TOC entry 4344 (class 1259 OID 16522)
-- Name: idx_ticket_tecnico; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX idx_ticket_tecnico ON public.ticket USING btree (tec_id);


--
-- TOC entry 4351 (class 2606 OID 16498)
-- Name: laptop fk_laptop_usuario; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.laptop
    ADD CONSTRAINT fk_laptop_usuario FOREIGN KEY (usu_id_laptop) REFERENCES public.usuario(id_usuario) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4352 (class 2606 OID 16517)
-- Name: ticket fk_ticket_laptop; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT fk_ticket_laptop FOREIGN KEY (lap_id) REFERENCES public.laptop(id_laptop) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4353 (class 2606 OID 16512)
-- Name: ticket fk_ticket_tecnico; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT fk_ticket_tecnico FOREIGN KEY (tec_id) REFERENCES public.tecnico(id_tecnico) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4515 (class 0 OID 0)
-- Dependencies: 4514
-- Name: DATABASE defaultdb; Type: ACL; Schema: -; Owner: avnadmin
--



-- Completed on 2026-09-29 09:25:39 -05

--
-- PostgreSQL database dump complete
--


