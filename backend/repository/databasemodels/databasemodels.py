from sqlalchemy import Column, Integer, String, UUID, Date, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import relationship, Mapped, mapped_column, DeclarativeBase

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'

    id = mapped_column(UUID(as_uuid=True), primary_key=True, index=True)
    email = mapped_column(String(120))
    password = mapped_column(String(120))
    projects = relationship("Project", back_populates="user")

class Project(Base):
    __tablename__ = 'projects'

    id = mapped_column(UUID(as_uuid=True), primary_key=True, index=True)
    title = Column(String, index=True)
    status = Column(String, index=True)
    start = Column(Date)
    end = Column(Date)
    user_id = Column(UUID, ForeignKey('users.id'))
    user = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="projects")

class Task(Base):
    __tablename__ = 'tasks'

    id = mapped_column(UUID(as_uuid=True), primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, index=True)
    finish_date = Column(Date)
    project_id = Column(UUID, ForeignKey('projects.id'))
    projects = relationship("Project", back_populates="tasks")

