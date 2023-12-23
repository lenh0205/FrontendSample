# <nav/> Tag
* tạo 1 block cho 1 tập navigation links, _không cần cũng được_
* Browsers, such as screen readers **`for disabled users`**, can use this element to determine whether to omit the initial rendering of this content
```html
<nav>
  <a href="/html/">HTML</a> |
  <a href="/css/">CSS</a> |
</nav>
```

# Nav (bootstrap)
* mặc định sử dụng những thẻ <div/> để style, <Nav.Link> thì s/d thẻ <a/>
* thường thì không s/d <ul/> và <li/> vì **`ul > a`** là invalid markup
```js
<Nav 
    defaultActiveKey="/home"
    className="flex-column align-items-center" // nav theo chiều dọc, căn giữa
    variant="pills" // nav item dạng "contained" thay vì "outlined" khi active
    variant="underline" // nav item có dấu gách dưới khi active
    fill // nav item sẽ lấp đầy space trong nav
    justify // để nav item có cùng kích thước và lấp đầy nav
>
    <Nav.Item>
        <Nav.Link href="/home">Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link eventKey="link-1">Link</Nav.Link>
    </Nav.Item>
    <NavDropdown title="Dropdown" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
      </NavDropdown>
</Nav>
```

# Tabs by Nav
* Visually represent nav items as "tabs"
```js
<Nav variant="tabs" defaultActiveKey="/home">
    .......    
</Nav>
```

# NavBar
```js
<Navbar 
    expand="lg" // tự động thành dạng nút sổ ra menu khi < "lg"
    className="bg-body-tertiary"
    fixed="bottom" // vị trí fixed bottom
>
    <Container> {/* not neccessary but can use for styling */}
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                </NavDropdown>
                <Navbar.Text>  /* text and non-nav link  */
                    Signed in as: <a href="#login">Mark Otto</a>
                </Navbar.Text>
            </Nav>
        </Navbar.Collapse>
    </Container>
</Navbar>
```
================================================
# Tabs
* Tabs is a higher-level component, creating a <Nav/> matched with a set of <TabPane/>
```js
const [key, setKey] = useState('home');

<Tabs
    defaultActiveKey="profile"
    id="uncontrolled-tab-example"
    className="mb-3"
    activeKey={key}
    onSelect={(k) => setKey(k)}
>
      <Tab eventKey="home" title="Home" disabled>
        Tab content for Home
      </Tab>
      <Tab eventKey="profile" title="Profile">
        Tab content for Profile
      </Tab>
      <Tab eventKey="contact" title="Contact" disabled>
        Tab content for Contact
      </Tab>
</Tabs>
```

* For more complex layouts, use the flexible **TabContainer**, **TabContent**, and **TabPane** components along with any style of **Nav**
```js
<Tab.Container id="left-tabs-example" defaultActiveKey="first">
    <Row>
        <Col sm={3}>
            <Nav variant="pills" className="flex-column">
            <Nav.Item>
                <Nav.Link eventKey="first">Tab 1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="second">Tab 2</Nav.Link>
            </Nav.Item>
            </Nav>
        </Col>
        <Col sm={9}>
            <Tab.Content>
            <Tab.Pane eventKey="first">First tab content</Tab.Pane>
            <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
            </Tab.Content>
        </Col>
    </Row>
</Tab.Container>
```
