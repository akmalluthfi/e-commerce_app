import { useRef, useState } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import {
  BoxArrowRight,
  CardChecklist,
  CaretRightFill,
  Person,
} from 'react-bootstrap-icons';
import { Outlet } from 'react-router-dom';
import ProfileMenuItem from '../components/ProfileMenuItem';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getAccTk,
  getApiKey,
  getBaseUrl,
  removeAccTk,
} from '../models/storage';
import axios from 'axios';

export default function User() {
  const btnToggle = useRef(null);
  const [navExpand, setNavExpand] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Logout',
      text: 'Are you sure want to logout?',
      allowOutsideClick: false,
      showDenyButton: true,
      denyButtonText: 'Logout',
      confirmButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isDenied) {
        try {
          // call api logout
          const url = `${getBaseUrl()}/customers/logout`;
          const headers = {
            'Content-Type': 'application/json',
            'x-api-key': getApiKey(),
            'access-token': getAccTk(),
          };

          const response = await axios.post(url, null, { headers });

          if (!response.data.success) throw new Error(response.data.message);

          if (!removeAccTk()) throw new Error('Logout Failed');
          // hapus local storange
          // pindahkan halaman ke login
          window.location.replace('/login');
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong!',
            text: error,
          });
        }
      }
    });
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={4}>
          <Navbar
            expanded={navExpand}
            expand='md'
            onToggle={(toggle) =>
              (btnToggle.current.style.transform = toggle
                ? 'rotate(90deg)'
                : 'rotate(0deg)')
            }
          >
            <Container className='flex-md-column align-items-center align-items-md-start'>
              <Navbar.Brand className='px-3'>Menu</Navbar.Brand>
              <Navbar.Toggle
                aria-controls='profile-nav'
                as='div'
                className='border-0 col text-end p-0'
                onClick={() => setNavExpand((prev) => !prev)}
                style={{ cursor: 'pointer' }}
              >
                <CaretRightFill
                  ref={btnToggle}
                  style={{ transition: 'transform 150ms ease' }}
                  size={26}
                />
              </Navbar.Toggle>
              <Navbar.Collapse className='w-100' id='profile-nav'>
                <Nav className='flex-column w-100' defaultActiveKey='profile'>
                  <NavLink
                    to='profile'
                    className='nav-link'
                    onClick={() =>
                      window.screen.availWidth < 768 ? setNavExpand(false) : ''
                    }
                  >
                    <ProfileMenuItem
                      name='Profile'
                      icon={
                        <Person size={20} className='align-text-bottom me-2' />
                      }
                    />
                  </NavLink>
                  <NavLink
                    to='order'
                    className='nav-link'
                    onClick={() =>
                      window.screen.availWidth < 768 ? setNavExpand(false) : ''
                    }
                  >
                    <ProfileMenuItem
                      name='My Orders'
                      icon={
                        <CardChecklist
                          size={20}
                          className='align-text-bottom me-2'
                        />
                      }
                    />
                  </NavLink>
                  {/* Login */}
                  <Nav.Link onClick={handleLogout}>
                    <ProfileMenuItem
                      name='Logout'
                      icon={
                        <BoxArrowRight
                          size={20}
                          className='align-text-bottom me-2'
                        />
                      }
                      className='text-danger'
                    />
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Col>
        <Col md={8}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
