import {
    Card,
    Input,
    Button,
    Typography,
    List,
    ListItem,
    ListItemSuffix,
    IconButton,
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import http from "../services/httpService";
import UserContext from "../userContext"
import { useNavigate } from "react-router-dom";

const Manager = () => {
    const { user } = useContext(UserContext);
    const [project, setProject] = useState({
        title: "",
        startDate: ""
    })
    const [projectUpdate, setProjectUpdate] = useState({
        title: "",
        startDate: ""
    })
    const [projects, setProjects] = useState([])
    const navigate = useNavigate();

    const fetchProjects = async () => {
        const response = await http.get("projects");
        let storedProjects = [...JSON.parse(response.data)]
        storedProjects.map((p) => {
            let storedDate = p.start.split("-").reverse();
            p.startDate = storedDate.join("/")
        });
        setProjects([...storedProjects]);
    };

    const deleteProject = async (id: string) => {
        const originalProjects = [...projects];
        try {
            let updated_project = projects.filter((p) => p.id == id);
            projects.splice(projects.indexOf(updated_project), 1);

            await http.http_delete(`projects/${id}`, { id: id }).then(() => {
                setProjects([...projects])
            } ).catch(() => setProjects([...originalProjects]))
        } catch (ex) {
            console.log(ex.error)
            setProjects([...originalProjects]);
        }
    };

    const loadProjectUpdate = (id) => {
        console.log("loadProjectUpdate")
        let updatedProject = projects.filter((p) => p.id == id);
        setProjectUpdate({
            id: updatedProject[0].id,
            title: updatedProject[0].title,
            startDate: updatedProject[0].startDate
        })
    }

    useEffect(() => {
        if (!user.email) {
            navigate("/login")
        } else {
            fetchProjects()
        }
    }, [])

    const handleChangeProject = ({ currentTarget: input }) => {
        let newProject = structuredClone(project);
        newProject[input.name] = input.value;
        setProject(newProject);
    };
    
    const handleChangeUpdateProject = ({ currentTarget: input }) => {
        let newProject = structuredClone(projectUpdate);
        newProject[input.name] = input.value;
        setProjectUpdate(newProject);
    };

    const handleCreateProject = async (event) => {
        event.preventDefault();

        if (!project.title || !project.startDate) {
            console.log("Data incomplete!")
        } else {
            try {
                const response = http.post("project", project).then(() => {
                    setProject({
                        title: "",
                        startDate: ""
                    })
                    fetchProjects();
                });
            } catch (ex) {
                console.log(ex.message);
            }
        }
    };
   
    const handleUpdateProject = async (event) => {
        event.preventDefault();

        if (!projectUpdate.title || !projectUpdate.startDate) {
            console.log("Data incomplete!")
        } else {
            try {
                const response = http.put(`projects/${projectUpdate.id}`, projectUpdate).then(() => {
                    setProjectUpdate({
                        title: "",
                        startDate: ""
                    })
                    fetchProjects()
                });
            } catch (ex) {
                console.log(ex.message);
            }
        }
    };

    function formatDate(dateString: string): string {
        // Remove non-numeric characters
        let date = dateString.replace(/\D/g, '');
        // Format the date (e.g., DD/M/YYYY)
        date = date.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');

        return date
    }

    function TrashIcon() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                    clipRule="evenodd"
                />
            </svg>
        );
    }

    return (
        <>
            <div className="flex w-full flex-row gap-5">
                <Card color="transparent" shadow={false} className="w-1/2">
                    <Typography variant="h4" color="blue-gray">
                        New Project
                    </Typography>
                    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-6">
                            <Typography variant="h6" color="blue-gray" className="-mb-3">
                                Title
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="Sails"
                                value={project.title}
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                name="title"
                                onChange={handleChangeProject}
                            />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">
                                Start date
                            </Typography>
                            <Input
                                size="lg"
                                value={formatDate(project.startDate)}
                                placeholder="  /  /    "
                                name="startDate"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                onChange={handleChangeProject}
                            />
                        </div>
                        <Button className="mt-6" fullWidth onClick={handleCreateProject}>
                            Create
                        </Button>
                    </form>
                </Card>

                <Card color="transparent" shadow={false} className="w-1/2">
                    <Typography variant="h4" color="blue-gray">
                        Update Project
                    </Typography>
                    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-6">
                            <Typography variant="h6" color="blue-gray" className="-mb-3">
                                Title
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="Sails"
                                value={projectUpdate.title}
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                name="title"
                                onChange={handleChangeUpdateProject}
                            />
                            <Typography variant="h6" color="blue-gray" className="-mb-3">
                                Start date
                            </Typography>
                            <Input
                                size="lg"
                                value={formatDate(projectUpdate.startDate)}
                                placeholder="  /  /    "
                                name="startDate"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                onChange={handleChangeUpdateProject}
                            />
                        </div>
                        <Button className="mt-6" fullWidth onClick={handleUpdateProject}>
                            Update
                        </Button>
                    </form>
                </Card>
            </div>
            <Card className="w-full">
                <List>
                    {projects.map((project) => {
                        return (
                            <ListItem ripple={false} className="py-1 pr-1 pl-4" key={project.id + "Delete"} onClick={() => {loadProjectUpdate(project.id)}}>
                                {project.title}
                                <ListItemSuffix>
                                    <IconButton variant="text" color="blue-gray" id={project.id} onClick={() => deleteProject(project.id)}>
                                    <TrashIcon />
                                    </IconButton>
                                </ListItemSuffix>
                            </ListItem>
                        )
                    })}
                </List>
            </Card>
        </>
    )
}

export default Manager;