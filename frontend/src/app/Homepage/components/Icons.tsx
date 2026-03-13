import React from 'react';

type IconProps = {
    className?: string;
    width?: number;
    height?: number;
    color?: string;
};

export const RoadmapIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill={color} />
    </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z" fill={color} />
    </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H7V10H12V7.47C13.93 7.96 15.48 9.38 15.93 11.23H12V11.99Z" fill={color} />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill={color} />
    </svg>
);

export const TargetIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill={color} />
    </svg>
);

export const GamepadIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21 6H3C1.9 6 1 6.9 1 8V16C1 17.1 1.9 18 3 18H21C22.1 18 23 17.1 23 16V8C23 6.9 22.1 6 21 6ZM6 13.5C5.17 13.5 4.5 12.83 4.5 12C4.5 11.17 5.17 10.5 6 10.5C6.83 10.5 7.5 11.17 7.5 12C7.5 12.83 6.83 13.5 6 13.5ZM9 10.5H11V8.5H9V10.5ZM19 13H17V15H15V13H13V11H15V9H17V11H19V13Z" fill={color} />
    </svg>
);

export const GraduationIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" fill={color} />
    </svg>
);

export const SecurityIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H7V10H12V7.47C13.93 7.96 15.48 9.38 15.93 11.23H12V11.99Z" fill={color} />
        <path d="M12 7C14.21 7 16 8.79 16 11H17V11.99H16V14H8V11.99H7V11C7 8.79 8.79 7 12 7ZM10 11H14V9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9V11Z" fill={color === 'currentColor' ? '#000' : 'currentColor'} opacity="0.5" />
    </svg>
);

export const SkullIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2C7.58 2 4 5.58 4 10C4 11.96 4.7 13.76 5.87 15.17L3.41 17.63L4.83 19.05L7.29 16.59C8.7 17.76 10.5 18.46 12.46 18.46V22H11.54V18.46C13.5 18.46 15.3 17.76 16.71 16.59L19.17 19.05L20.59 17.63L18.13 15.17C19.3 13.76 20 11.96 20 10C20 5.58 16.42 2 12 2ZM8 11C7.17 11 6.5 10.33 6.5 9.5C6.5 8.67 7.17 8 8 8C8.83 8 9.5 8.67 9.5 9.5C9.5 10.33 8.83 11 8 11ZM16 11C15.17 11 14.5 10.33 14.5 9.5C14.5 8.67 15.17 8 16 8C16.83 8 17.5 8.67 17.5 9.5C17.5 10.33 16.83 11 16 11Z" fill={color} />
    </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill={color} />
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill={color} />
    </svg>
);

export const LibraryIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM10 9H18V11H10V9ZM10 12H15V14H10V12ZM10 5H18V7H10V5Z" fill={color} />
    </svg>
);

export const NoteIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill={color} />
        <path d="M0 0h24v24H0z" fill="none" />
    </svg>
);
export const TwitterIcon: React.FC<IconProps> = ({ className, width = 20, height = 20, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M22.46 6C21.69 6.35 20.85 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16.02 6.03 17.27 7.93 17.3C6.44 18.47 4.57 19.17 2.52 19.17C2.17 19.17 1.82 19.15 1.48 19.11C3.42 20.35 5.71 21.08 8.18 21.08C16.22 21.08 20.61 14.41 20.61 8.61C20.61 8.42 20.61 8.23 20.59 8.04C21.48 7.43 22.25 6.63 22.84 5.72C22.7 5.78 22.58 5.89 22.46 6Z" fill={color} />
    </svg>
);

export const GithubIcon: React.FC<IconProps> = ({ className, width = 20, height = 20, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.867 20.166 8.839 21.489C9.339 21.581 9.521 21.272 9.521 21.007C9.521 20.768 9.512 20.134 9.507 19.294C6.729 19.897 6.142 17.957 6.142 17.957C5.688 16.805 5.032 16.498 5.032 16.498C4.127 15.879 5.101 15.891 5.101 15.891C6.098 15.961 6.623 16.917 6.623 16.917C7.509 18.434 8.948 17.996 9.515 17.741C9.605 17.099 9.862 16.661 10.144 16.415C7.926 16.163 5.594 15.304 5.594 11.472C5.594 10.381 5.981 9.49 6.618 8.791C6.516 8.538 6.173 7.519 6.716 6.141C6.716 6.141 7.554 5.873 9.462 7.165C10.259 6.945 11.112 6.835 11.96 6.831C12.808 6.835 13.661 6.945 14.46 7.165C16.366 5.873 17.202 6.141 17.202 6.141C17.746 7.519 17.403 8.538 17.302 8.791C17.941 9.49 18.326 10.381 18.326 11.472C18.326 15.314 15.991 16.16 13.766 16.407C14.125 16.715 14.444 17.327 14.444 18.262C14.444 19.605 14.432 20.69 14.432 21.015C14.432 21.282 14.612 21.593 15.119 21.493C19.088 20.162 21.954 16.416 21.954 12C21.954 6.477 17.477 2 12 2Z" fill={color} />
    </svg>
);

export const DiscordIcon: React.FC<IconProps> = ({ className, width = 20, height = 20, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18.942 5.556C17.493 4.887 15.901 4.394 14.223 4.108C14.195 4.103 14.167 4.116 14.152 4.143C13.943 4.516 13.711 5.006 13.55 5.385C11.751 5.116 9.96 5.116 8.188 5.385C8.028 5.006 7.788 4.516 7.578 4.143C7.563 4.116 7.535 4.103 7.507 4.108C5.829 4.393 4.237 4.887 2.787 5.556C2.775 5.562 2.766 5.572 2.76 5.584C-0.103 9.866 -0.887 14.041 0.499 18.156C0.502 18.167 0.509 18.176 0.518 18.182C2.41 19.573 4.243 20.418 6.04 20.975C6.069 20.984 6.1 20.973 6.118 20.948C6.544 20.366 6.921 19.747 7.245 19.096C7.262 19.062 7.246 19.022 7.211 19.009C6.611 18.781 6.041 18.502 5.498 18.182C5.459 18.159 5.457 18.103 5.494 18.077C5.61 17.99 5.723 17.901 5.832 17.81C5.852 17.794 5.879 17.791 5.901 17.802C9.575 19.483 13.554 19.483 17.185 17.802C17.207 17.791 17.234 17.794 17.254 17.81C17.363 17.901 17.476 17.99 17.593 18.077C17.63 18.103 17.628 18.159 17.589 18.182C17.045 18.502 16.476 18.781 15.875 19.009C15.84 19.022 15.824 19.062 15.841 19.096C16.171 19.747 16.548 20.366 16.973 20.948C16.991 20.973 17.022 20.984 17.051 20.975C18.847 20.418 20.681 19.573 22.573 18.182C22.582 18.176 22.589 18.167 22.592 18.156C24.167 13.504 23.754 9.358 20.971 5.584C20.966 5.572 20.957 5.562 20.945 5.556Z" fill={color} />
    </svg>
);
export const MergeIcon: React.FC<IconProps> = ({ className, width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 15.69 8.04 16.19L15.14 20.3C15.09 20.53 15.05 20.76 15.05 21C15.05 22.66 16.39 24 18.05 24C19.71 24 21.05 22.66 21.05 21C21.05 19.34 19.71 18 18.05 18C17.26 18 16.55 17.69 16.01 17.19L8.91 13.08C8.96 12.85 9 12.62 9 12.38L18 16.08Z" fill={color} />
    </svg>
);
