import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useEditUserMutation,
  useLazyAllRolesQuery,
  useLazyGetUserQuery,
} from "../features/api/userApi";
import type { TResponseDto } from "../types/TResponseDto";
import type { TUserUpdateRequest } from "../types/TUserUpdatRequest";
import "./../css/General.css";

const EditUser = () => {
  const [active, setActive] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [role, setRole] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();


  const [saving, ] = useState(false);
  const [error, setError] = useState("");
  const [success,] = useState("");

  const { userId } = useParams();

  //crud hooks
  const [editUser] = useEditUserMutation();
  const [getUser] = useLazyGetUserQuery();
    const [getRoles] = useLazyAllRolesQuery();

  /*
   * Load user
   */
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const response = await getUser(userId as string);

    if (response.data) {
      const { data, httpStatus } = response.data as TResponseDto;

      if (httpStatus === 200) {
        const { firstName, lastName, dob, email, termsAccepted, roles } = data;

        setFirstName(firstName);
        setLastName(lastName);
        setDateOfBirth(dob);
        setEmail(email);
        setActive(termsAccepted);
        setRole(roles[0]);
      }
    }
    if (response.error) {
      const { status } = response?.error as { data: any; status: number };

      if (status === 401) {
        setError("Oops, operation forbidden or user does not exist");
      }
    }
  };


    /***
     * * fetch roles
     */
  
    async function fetchRoles(){
      const response = await getRoles();
     
      setRoles(response.data as string[])
    }
  
    useEffect(()=>{
  fetchRoles()
    },[])

    
  const handleFormSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const dto: TUserUpdateRequest = {
      userId: parseInt(userId as string),
      firstName,
      lastName,
      email,
      role,
      isTermsAccepted: active,
      dob: dateOfBirth as Date,
      password,
    };


    try {
      const response = await editUser(dto);

      if (response.data) {
        const { httpStatus, message } = response.data as {
          message: string;
          httpStatus: number;
        };
        if (httpStatus === 400) {
          setError(message);
        }
        if (httpStatus === 403) {
          setError(message);
        }
        if (httpStatus === 200) {
          navigate("/account/admin/users");
        }
      }

      if (response.error) {
        const { data } = response?.error as {
          data: {
            error: {
              name: string;
              password: string;
              firstName: string;
              lastName: string;
              dob: string;
              isTermsAccepted: string;
            };
          };
          message: string;
          status: number;
        };

        const { isTermsAccepted, password, lastName, firstName, dob } =
          data.error;
        setError(
          `${firstName ? firstName : ""}\n ${lastName ? lastName : ""}\n ${dob ? dob : ""}\n ${password ? password : ""}\n ${isTermsAccepted ? isTermsAccepted : ""}`,
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setDateOfBirth(null);
    setEmail("");
    setActive(false);
    setRole("");
  };


    const handleSelectChange = (input:string)=>{
    setRole(input)
  }


  return (
    <main className="add-category">
      {/* =====================================================
                HEADER
            ====================================================== */}

      <header className="add-category__header">
        <div>
          <span className="add-category__eyebrow">Users</span>

          <h1 className="add-category__title">Edit user</h1>

          <p className="add-category__description">Edit a User from admin</p>
        </div>
      </header>

      {/* =====================================================
                CONTENT
            ====================================================== */}

      <div className="add-category__content">
        {/* =================================================
                    FORM
                ================================================== */}

        <section className="add-category__form-card">
          <form
            className="add-category__form"
            onSubmit={handleFormSubmit}
          >
            <div className="add-category__row">
              {/* =================================================
                            FIRST NAME
                        ================================================== */}

              <div className="add-category__field">
                <label
                  htmlFor="category-name"
                  className="add-category__label"
                >
                  First name
                </label>

                <input
                  id="category-name"
                  name="firstName"
                  type="text"
                  value={firstName}
                  placeholder="e.g. John"
                  className="add-category__input"
                  maxLength={100}
                  disabled={saving}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <span className="add-category__hint">
                  Enter user given name
                </span>
              </div>

              {/* =================================================
                            LAST NAME
                        ================================================== */}
              <div className="add-category__field">
                <label
                  htmlFor="category-name"
                  className="add-category__label"
                >
                  Last name
                </label>

                <input
                  id="category-name"
                  name="lastName"
                  type="text"
                  value={lastName}
                  placeholder="e.g. Doe"
                  className="add-category__input"
                  maxLength={100}
                  disabled={saving}
                  onChange={(e) => setLastName(e.target.value)}
                />

                <span className="add-category__hint">
                  Enter user family name
                </span>
              </div>
            </div>

            <div className="add-category__row">
              {/* =================================================
                          USERNAME/EMAIL
                        ================================================== */}

              <div className="add-category__field">
                <label
                  htmlFor="category-name"
                  className="add-category__label"
                >
                  Email
                </label>

                <input
                  id="category-name"
                  name="email"
                  type="email"
                  value={email}
                  placeholder="e.g. Doe"
                  className="add-category__input"
                  maxLength={100}
                  disabled={saving}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <span className="add-category__hint">Enter user email</span>
              </div>

              {/* =================================================
                         USER'S ROLE
                        ================================================== */}
              <div className="add-category__field">
                <label
                  htmlFor="category-name"
                  className="add-category__label"
                >
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  className="add-category__input"
                  onChange={(e) => handleSelectChange(e.target.value)}
                 value={role}
                >
                  <option
                    value=""
                    disabled
                
                  >
                    choose role
                  </option>
                  {roles?.map((item) => {
                    return (
                      <option
                        key={item}
                        value={item}
                    
                      >
                        {item}
                      </option>
                    );
                  })}
                </select>
                <span className="add-category__hint">Enter user role</span>
              </div>
            </div>

            {/* =================================================
                      DATE OF BIRTH
                        ================================================== */}
            <div className="add-category__field">
              <label
                htmlFor="category-name"
                className="add-category__label"
              >
                Date of birth
              </label>

              <input
                id="category-name"
                name="dob"
                type="Date"
                value={
                  dateOfBirth
                    ? new Date(dateOfBirth).toISOString().split("T")[0]
                    : ""
                }
                placeholder="e.g. user"
                className="add-category__input"
                maxLength={100}
                disabled={saving}
                onChange={(e) => setDateOfBirth(e.target.valueAsDate)}
              />

              <span className="add-category__hint">
                Enter user Date of birth
              </span>
            </div>

            {/* =================================================
                      PASSWORD
                        ================================================== */}
            <div className="add-category__field">
              <label
                htmlFor="category-name"
                className="add-category__label"
              >
                Password
              </label>

              <input
                id="category-name"
                name="password"
                type="password"
                value={password}
                placeholder=""
                className="add-category__input"
                maxLength={100}
                disabled={saving}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span className="add-category__hint">
                Set default user password
              </span>
            </div>

            {/* =================================================
                            ACTIVE
                        ================================================== */}

            <label className="add-category__checkbox">
              <input
                type="checkbox"
                name="isActive"
                checked={active}
                disabled={saving}
                onChange={(e) => setActive(e.target.checked)}
              />

              <span>active</span>
            </label>

            {/* =================================================
                            MESSAGES
                        ================================================== */}

            {error && (
              <div className="add-category__message add-category__message--error">
                {error}
              </div>
            )}

            {success && (
              <div className="add-category__message add-category__message--success">
                {success}
              </div>
            )}

            {/* =================================================
                            ACTIONS
                        ================================================== */}

            <div className="add-category__actions">
              <button
                onClick={() => resetFields()}
                type="button"
                className="add-category__cancel"
                disabled={saving}
              >
                Clear
              </button>

              <button
                type="submit"
                className="add-category__submit"
                disabled={saving}
              >
                {"Update user"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default EditUser;
